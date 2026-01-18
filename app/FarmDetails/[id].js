import { API_URL } from "@/server/config";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AnimatedScreen from '../../components/AnimatedScreen';

export default function FarmDetails() {
  const { id } = useLocalSearchParams();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  const [markedDates, setMarkedDates] = useState({});
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [quote, setQuote] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [nights, setNights] = useState(0);
  const [priceError, setPriceError] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        setCurrentUser(res.data);
      } catch (err) {
        console.error('خطأ في جلب بيانات المستخدم', err);
      }
    };
    fetchUser();
  }, []);

  // دالة جلب الحجوزات منفصلة
  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bookings/${id}`);
      setBookings(response.data);
      return response.data;
    } catch (err) {
      console.error('خطأ في جلب الحجوزات:', err);
      setBookings([]);
      return [];
    }
  };

  // دالة حساب السعر في الوقت الفعلي
  const fetchQuote = useCallback(async (startDate, endDate) => {
    if (!startDate || !farm?._id) return;
    
    setIsCalculatingPrice(true);
    setPriceError(null);
    
    try {
      // إضافة يوم واحد لتاريخ النهاية لحساب السعر بشكل صحيح
      const calcEndDate = new Date(endDate || startDate);
      calcEndDate.setDate(calcEndDate.getDate() + 1);
      const endDateString = calcEndDate.toISOString().split('T')[0];
      
      const { data } = await axios.post(`${API_URL}/api/farms/quote/${farm._id}`, {
        from: startDate,
        to: endDateString
      });
      
      setQuote(data.totalPrice);
      
      // حساب عدد الليالي
      const start = new Date(startDate);
      const end = new Date(endDate || startDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      setNights(diffDays);
      
    } catch (err) {
      console.error('خطأ في حساب السعر:', err);
      setPriceError(err.response?.data?.message || 'تعذّر حساب السعر');
      setQuote(null);
    } finally {
      setIsCalculatingPrice(false);
    }
  }, [farm?._id]);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/farms/${id}`);
        setFarm(response.data);

        // جلب الحجوزات منفصلة
        const farmBookings = await fetchBookings();

        const booked = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0); // إزالة الوقت لضمان المقارنة الصحيحة

        // إضافة الأيام السابقة كأيام معطلة
        const pastDates = {};
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 365); // سنة سابقة كحد أقصى

        while (startDate < today) {
          const dateStr = startDate.toISOString().split('T')[0];
          pastDates[dateStr] = {
            disabled: true,
            disableTouchEvent: true,
            color: '#ccc',
            textColor: '#999'
          };
          startDate.setDate(startDate.getDate() + 1);
        }

        // إضافة الأيام المحجوزة من الحجوزات المحجوزة
        farmBookings?.forEach(booking => {
          // تجاهل الحجوزات الملغية
          if (booking.status === 'cancelled') return;
        
          const current = new Date(booking.from);
          const last = new Date(booking.to);
        
          while (current < last) {
            const dateStr = current.toISOString().split('T')[0];
            if (booking.status === 'confirmed') {
              booked[dateStr] = {
                disabled: true,
                disableTouchEvent: true,
                color: 'red', // مؤكد = أحمر
                textColor: 'white'
              };
            } else if (booking.status === 'pending') {
              booked[dateStr] = {
                disabled: true,
                disableTouchEvent: true,
                color: 'gold', // قيد الانتظار = أصفر
                textColor: 'black'
              };
            }
            current.setDate(current.getDate() + 1);
          }
        });

        // دمج الأيام السابقة مع الأيام المحجوزة
        setMarkedDates({ ...pastDates, ...booked });
      } catch (err) {
        setError(err.response?.data?.message || 'خطأ في جلب بيانات المزرعة');
      } finally {
        setLoading(false);
      }
    };
    fetchFarm();
  }, [id]);

  const getDatesRange = (start, end) => {
    let range = [];
    let current = new Date(start);
    let last = new Date(end);

    while (current <= last) {
      range.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return range;
  };

  // إعادة تعيين اختيار التواريخ
  const resetDateSelection = useCallback(() => {
    setFromDate(null);
    setToDate(null);
    setQuote(null);
    setNights(0);
    setPriceError(null);
  }, []);

  const onDayPress = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(day.dateString);
    selectedDate.setHours(0, 0, 0, 0);

    // منع اختيار الأيام السابقة
    if (selectedDate < today) {
      return Alert.alert('تنبيه', 'لا يمكن حجز أيام سابقة', [{ text: 'حسناً', style: 'default' }]);
    }

    // لو اليوم محجوز، ما نسمح بالضغط
    if (markedDates[day.dateString]?.disabled) {
      const isBooked = bookings?.some(b => {
        const start = new Date(b.from);
        const end = new Date(b.to);
        const selected = new Date(day.dateString);
        return selected >= start && selected < end;
      });
      
      if (isBooked) {
        return Alert.alert('غير متاح', 'هذا اليوم محجوز مسبقاً. يرجى اختيار تاريخ آخر.', [{ text: 'حسناً', style: 'default' }]);
      }
      return;
    }

    // إذا سبق الاختيار (بداية ونهاية)، وإضغط على أي يوم جديد => إعادة الاختيار
    if (fromDate && toDate) {
      setFromDate(day.dateString);
      setToDate(null);
      setQuote(null);
      setNights(0);
      setPriceError(null);

      // إعادة تلوين الأيام المحجوزة والأيام السابقة
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const pastDates = {};
      const startDate = new Date(todayDate);
      startDate.setDate(startDate.getDate() - 365);

      while (startDate < todayDate) {
        const dateStr = startDate.toISOString().split('T')[0];
        pastDates[dateStr] = {
          disabled: true,
          disableTouchEvent: true,
          color: '#ccc',
          textColor: '#999'
        };
        startDate.setDate(startDate.getDate() + 1);
      }

      const booked = { ...pastDates };
      bookings?.forEach(booking => {
        if (booking.status === 'cancelled') return;
        const current = new Date(booking.from);
        const last = new Date(booking.to);

        while (current < last) {
          const dateStr = current.toISOString().split('T')[0];
          if (booking.status === 'confirmed') {
            booked[dateStr] = { disabled: true, disableTouchEvent: true, color: '#e74c3c', textColor: 'white' };
          } else if (booking.status === 'pending') {
            booked[dateStr] = { disabled: true, disableTouchEvent: true, color: '#f39c12', textColor: 'white' };
          }
          current.setDate(current.getDate() + 1);
        }
      });

      // إضافة اليوم الجديد كبداية
      booked[day.dateString] = { startingDay: true, color: '#0077b6', textColor: 'white' };
      setMarkedDates(booked);
      
      // حساب السعر ليوم واحد
      fetchQuote(day.dateString, day.dateString);
      return;
    }

    if (!fromDate) {
      setFromDate(day.dateString);
      setMarkedDates(prev => ({
        ...prev,
        [day.dateString]: { startingDay: true, color: '#0077b6', textColor: 'white' }
      }));
      // حساب السعر ليوم واحد
      fetchQuote(day.dateString, day.dateString);
    } else {
      // التأكد من أن تاريخ النهاية بعد تاريخ البداية
      const startDateObj = new Date(fromDate);
      const endDateObj = new Date(day.dateString);
      
      if (endDateObj < startDateObj) {
        // إذا كان تاريخ النهاية قبل البداية، اعتبره تاريخ بداية جديد
        setFromDate(day.dateString);
        setToDate(null);
        setQuote(null);
        setNights(0);
        setMarkedDates(prev => {
          const newMarked = { ...prev };
          // إزالة تحديد البداية السابقة
          if (newMarked[fromDate] && !newMarked[fromDate].disabled) {
            delete newMarked[fromDate];
          }
          newMarked[day.dateString] = { startingDay: true, color: '#0077b6', textColor: 'white' };
          return newMarked;
        });
        fetchQuote(day.dateString, day.dateString);
        return;
      }

      const range = getDatesRange(fromDate, day.dateString);
      const marked = { ...markedDates };

      let validRange = true;
      let blockedDate = null;
      range.forEach(date => {
        if (marked[date]?.disabled) {
          validRange = false;
          blockedDate = date;
        }
      });

      if (!validRange) {
        return Alert.alert(
          'تواريخ غير متاحة', 
          'الفترة المختارة تحتوي على أيام محجوزة. يرجى اختيار فترة أخرى.',
          [{ text: 'حسناً', style: 'default' }]
        );
      }

      if (range.length === 1) {
        marked[range[0]] = { startingDay: true, endingDay: true, color: '#0077b6', textColor: 'white' };
      } else {
        range.forEach((date, index) => {
          if (index === 0) {
            marked[date] = { startingDay: true, color: '#0077b6', textColor: 'white' };
          } else if (index === range.length - 1) {
            marked[date] = { endingDay: true, color: '#0077b6', textColor: 'white' };
          } else {
            marked[date] = { color: '#90e0ef', textColor: 'white' };
          }
        });
      }

      setMarkedDates(marked);
      setToDate(day.dateString);
      
      // حساب السعر للفترة المختارة
      fetchQuote(fromDate, day.dateString);
    }
  };



  // دالة الانتقال لصفحة تأكيد الحجز
  const handleBooking = () => {
    // التحقق من تسجيل الدخول
    if (!currentUser) {
      return Alert.alert(
        'تسجيل الدخول مطلوب',
        'يرجى تسجيل الدخول لإتمام الحجز',
        [
          { text: 'إلغاء', style: 'cancel' },
          { text: 'تسجيل الدخول', onPress: () => router.push('/pages/Login/Login') }
        ]
      );
    }

    // التحقق من اختيار التواريخ
    if (!fromDate) {
      return Alert.alert(
        'اختيار التاريخ',
        'يرجى اختيار تاريخ البداية من التقويم',
        [{ text: 'حسناً', style: 'default' }]
      );
    }

    // التحقق من حساب السعر
    if (!quote || quote === 0) {
      return Alert.alert(
        'خطأ في السعر',
        'تعذّر حساب السعر. يرجى إعادة اختيار التواريخ.',
        [{ text: 'حسناً', style: 'default' }]
      );
    }

    // الانتقال لصفحة التأكيد
    router.push({
      pathname: '../FarmDetails/ConfirmBooking',
      params: {
        farmId: farm._id,
        farmName: farm?.name,
        fromDate,
        toDate: toDate || fromDate,
        quote: quote,
        nights: nights,
        userId: currentUser._id,
        userName: currentUser.name
      }
    });
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077b6" />
      </View>
    );
  }

  // Error screen
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <AnimatedScreen animationType="slideInUp" duration={600}>
      <LinearGradient colors={['#a8edea', '#fed6e3']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>


        {/* عرض الصور */}
        {farm?.images?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {farm.images.map((imgUri, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedImage(`${API_URL}/api/images/${imgUri}`)}>
                <Image source={{ uri: `${API_URL}/api/images/${imgUri}` }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* مودال عرض الصورة الكبيرة */}
        <Modal visible={!!selectedImage} transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          </View>
        </Modal>

        {/* اسم المزرعة */}
        <Text style={styles.title}>{farm?.name || '...'}</Text>

        {/* الوصف */}
        <Text style={[styles.sectionTitle, { alignSelf: 'flex-end' }]}>الوصف</Text>
        <Text style={styles.description}>{farm?.description || '...'}</Text>

        {/* الحالة والنوع */}
        <Text style={styles.status}>الحالة: {farm?.status || '...'}</Text>
        <Text style={styles.type}>نوع المزرعة: {farm?.type === 'sale' ? 'بيع' : 'إيجار'}</Text>
        <Text style={styles.address}>العنوان: {farm?.address?.address || farm?.address || 'غير محدد'}</Text>

        {/* التفاصيل الإضافية */}
        <Text style={[styles.sectionTitle, { alignSelf: 'flex-end' }]}>التفاصيل الإضافية</Text>
        <View style={styles.extraDetails}>
          {farm?.type === 'rent' && (
            <>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>
                  وقت بدء الحجز: {farm?.startBookingTime || '-'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>
                  وقت نهاية الحجز: {farm?.endBookingTime || '-'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="account-group" size={24} color="#0077b6" />
                <Text style={styles.detailText}>عدد الضيوف: {farm?.guests || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="bed-king-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>غرف النوم: {farm?.bedrooms || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="shower" size={24} color="#0077b6" />
                <Text style={styles.detailText}>الحمامات: {farm?.bathrooms || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar" size={24} color="#0077b6" />
                <Text style={styles.detailText}>سعر منتصف الأسبوع: {farm?.midweekPrice || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar-weekend" size={24} color="#0077b6" />
                <Text style={styles.detailText}>سعر نهاية الأسبوع: {farm?.weekendPrice || '-'}</Text>
              </View>
            </>
          )}

          {farm?.type === 'sale' && (
            <>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>
                  وقت بدء الحجز: {farm?.startBookingTime || '-'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>
                  وقت نهاية الحجز: {farm?.endBookingTime || '-'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="currency-usd" size={24} color="#0077b6" />
                <Text style={styles.detailText}>السعر: {farm?.price || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="ruler" size={24} color="#0077b6" />
                <Text style={styles.detailText}>المساحة : {farm?.sizeInHectars || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="account-group" size={24} color="#0077b6" />
                <Text style={styles.detailText}>عدد الضيوف: {farm?.guests || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="bed-king-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>غرف النوم: {farm?.bedrooms || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="shower" size={24} color="#0077b6" />
                <Text style={styles.detailText}>الحمامات: {farm?.bathrooms || '-'}</Text>
              </View>
            </>
          )}
        </View>

        {/* الأزرار حسب نوع المزرعة */}
        {farm?.type === 'rent' ? (
          <View style={styles.bookingBox}>
            {/* عنوان قسم الحجز */}
            <Text style={styles.bookingSectionTitle}>📅 اختر تاريخ الحجز</Text>
            
            {/* دليل الألوان */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.legendText}>محجوز (مؤكد)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f39c12' }]} />
                <Text style={styles.legendText}>قيد الانتظار</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#0077b6' }]} />
                <Text style={styles.legendText}>اختيارك</Text>
              </View>
            </View>

            {/* Calendar */}
            <Calendar
              markingType={'period'}
              markedDates={markedDates}
              onDayPress={onDayPress}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                todayTextColor: '#0077b6',
                arrowColor: '#0077b6',
                monthTextColor: '#0077b6',
                textMonthFontWeight: 'bold',
              }}
            />

            {/* عرض التواريخ المختارة */}
            {fromDate && (
              <View style={styles.selectedDatesContainer}>
                <View style={styles.dateCard}>
                  <Text style={styles.dateCardLabel}>تاريخ البداية</Text>
                  <Text style={styles.dateCardValue}>{new Date(fromDate).toLocaleDateString('ar-SA')}</Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color="#0077b6" />
                <View style={styles.dateCard}>
                  <Text style={styles.dateCardLabel}>تاريخ النهاية</Text>
                  <Text style={styles.dateCardValue}>
                    {toDate ? new Date(toDate).toLocaleDateString('ar-SA') : new Date(fromDate).toLocaleDateString('ar-SA')}
                  </Text>
                </View>
              </View>
            )}

            {/* عرض السعر */}
            <View style={styles.priceContainer}>
              {isCalculatingPrice ? (
                <View style={styles.priceLoadingContainer}>
                  <ActivityIndicator size="small" color="#0077b6" />
                  <Text style={styles.priceLoadingText}>جاري حساب السعر...</Text>
                </View>
              ) : priceError ? (
                <View style={styles.priceErrorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#e74c3c" />
                  <Text style={styles.priceErrorText}>{priceError}</Text>
                </View>
              ) : quote ? (
                <View style={styles.priceDisplayContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>عدد الليالي:</Text>
                    <Text style={styles.priceValue}>{nights} {nights === 1 ? 'ليلة' : 'ليالي'}</Text>
                  </View>
                  <View style={styles.priceDivider} />
                  <View style={styles.priceRow}>
                    <Text style={styles.totalPriceLabel}>السعر الإجمالي:</Text>
                    <Text style={styles.totalPriceValue}>{quote} $</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.selectDatesHint}>
                  <Ionicons name="information-circle-outline" size={20} color="#666" />
                  <Text style={styles.selectDatesText}>اختر التواريخ لرؤية السعر</Text>
                </View>
              )}
            </View>

            {/* زر إعادة التعيين */}
            {fromDate && (
              <TouchableOpacity style={styles.resetButton} onPress={resetDateSelection}>
                <Ionicons name="refresh" size={18} color="#666" />
                <Text style={styles.resetButtonText}>إعادة اختيار التواريخ</Text>
              </TouchableOpacity>
            )}

            {/* زر الحجز */}
            <TouchableOpacity
              style={[
                styles.mainBookButton,
                (!fromDate || !quote || isCalculatingPrice) && styles.mainBookButtonDisabled
              ]}
              onPress={handleBooking}
              disabled={!fromDate || !quote || isCalculatingPrice}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.mainBookButtonText}>
                {nights > 1 ? `حجز ${nights} ليالي` : 'حجز ليلة واحدة'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`https://wa.me/963949599136`)}>
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            <Text style={styles.contactButtonText}>تواصل عبر واتساب</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>رجوع</Text>
        </TouchableOpacity>
      </ScrollView>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, alignItems: 'center' },
  imagesContainer: { marginBottom: 20 },
  image: {
    width: 300,
    height: 200,
    borderRadius: 20,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: { width: '90%', height: '70%', resizeMode: 'contain' },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: { fontSize: 28, color: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0077b6', marginBottom: 10 },
  type: { fontSize: 18, marginBottom: 5 },
  status: { fontSize: 18, marginBottom: 5 },
  address: { fontSize: 16, fontStyle: 'italic', marginBottom: 15 },
  description: { fontSize: 18, color: '#333', textAlign: 'center', lineHeight: 26, marginBottom: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
  bookingBox: { 
    width: '100%', 
    marginTop: 20, 
    alignItems: 'center', 
    gap: 15,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077b6',
    textAlign: 'center',
    marginBottom: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  selectedDatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
    width: '100%',
  },
  dateCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#0077b6',
  },
  dateCardLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0077b6',
  },
  priceContainer: {
    width: '100%',
    marginTop: 10,
  },
  priceLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  priceLoadingText: {
    fontSize: 14,
    color: '#666',
  },
  priceErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 15,
    backgroundColor: '#ffeaea',
    borderRadius: 10,
  },
  priceErrorText: {
    fontSize: 14,
    color: '#e74c3c',
  },
  priceDisplayContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#28a745',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#c8e6c9',
    marginVertical: 10,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  totalPriceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
  },
  selectDatesHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  selectDatesText: {
    fontSize: 14,
    color: '#666',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  mainBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainBookButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  mainBookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#0077b6', marginTop: 15, marginBottom: 5 },
  extraDetails: { width: '100%', padding: 10, backgroundColor: '#d0f0fd', borderRadius: 10, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  detailText: { fontSize: 16, color: '#0077b6' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0077b6',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 30,
    marginBottom: 10,
    width: '100%'
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
