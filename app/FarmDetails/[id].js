import { API_URL } from "@/server/config";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  const onDayPress = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(day.dateString);
    selectedDate.setHours(0, 0, 0, 0);

    // منع اختيار الأيام السابقة
    if (selectedDate < today) {
      return Alert.alert('خطأ', 'لا يمكن حجز أيام سابقة');
    }

    // لو اليوم محجوز، ما نسمح بالضغط
    if (markedDates[day.dateString]?.disabled) {
      return Alert.alert('خطأ', 'هذا اليوم محجوز مسبقاً');
    }

    // إذا سبق الاختيار (بداية ونهاية)، وإضغط على أي يوم جديد => إعادة الاختيار
    if (fromDate && toDate) {
      setFromDate(day.dateString);
      setToDate(null);

      // إعادة تلوين الأيام المحجوزة والأيام السابقة
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pastDates = {};
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 365);

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

      const booked = { ...pastDates };
      bookings?.forEach(booking => {
        const current = new Date(booking.from);
        const last = new Date(booking.to);

        while (current < last) { // use exclusive end to avoid painting checkout day
          const dateStr = current.toISOString().split('T')[0];
          booked[dateStr] = { disabled: true, disableTouchEvent: true, color: 'red', textColor: 'white' };
          current.setDate(current.getDate() + 1);
        }
      });

      // إضافة اليوم الجديد كبداية
      booked[day.dateString] = { startingDay: true, color: '#0077b6', textColor: 'white' };
      setMarkedDates(booked);
      return;
    }

    if (!fromDate) {
      setFromDate(day.dateString);
      setMarkedDates(prev => ({
        ...prev,
        [day.dateString]: { startingDay: true, color: '#0077b6', textColor: 'white' }
      }));
    } else {
      const range = getDatesRange(fromDate, day.dateString);
      const marked = { ...markedDates };

      let validRange = true;
      range.forEach(date => {
        if (marked[date]?.disabled) validRange = false;
      });

      if (!validRange) {
        return Alert.alert('خطأ', 'الفترة المختارة تحتوي على أيام محجوزة أو سابقة');
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
    }
  };



  // دالة حجز يوم واحد
  const handleSingleDayBooking = async () => {
    if (!fromDate) {
      return Alert.alert('خطأ', 'يرجى اختيار يوم من التقويم');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(fromDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return Alert.alert('خطأ', 'لا يمكن حجز أيام سابقة');
    }

    try {
      // إضافة يوم واحد لتاريخ النهاية لحجز يوم واحد
      const endDate = new Date(fromDate);
      endDate.setDate(endDate.getDate() + 1);
      const endDateString = endDate.toISOString().split('T')[0];

      const { data } = await axios.post(`${API_URL}/api/farms/book/${id}`, {
        userId: currentUser._id,
        userName: currentUser.name,
        from: fromDate,
        to: endDateString // اليوم التالي
      });
      
      router.push({
        pathname: '../FarmDetails/ConfirmBooking',
        params: {
          farmId: farm._id,
          farmName: farm?.name,
          fromDate,
          toDate: fromDate, // نعرض للمستخدم نفس اليوم
          quote: data.totalPrice,
          userId: currentUser._id,
          userName: currentUser.name
        }
      });

    } catch (err) {
      Alert.alert('خطأ', err.response?.data?.message || 'تعذّر حساب السعر');
    }
  };

  // دالة حجز عدة أيام
  const handleMultiDayBooking = async () => {
    if (!fromDate || !toDate) {
      return Alert.alert('خطأ', 'يرجى اختيار فترة (من – إلى) من التقويم');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return Alert.alert('خطأ', 'لا يمكن حجز أيام سابقة');
    }

    try {
      // اجعل تاريخ النهاية حصرياً بإضافة يوم واحد لضمان احتساب آخر ليلة
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1);
      const endDateString = endDate.toISOString().split('T')[0];

      const { data } = await axios.post(`${API_URL}/api/farms/book/${id}`, {
        userId: currentUser._id,
        userName: currentUser.name,
        from: fromDate,
        to: endDateString
      });
      console.log(data)
      router.push({
        pathname: '../FarmDetails/ConfirmBooking',
        params: {
          farmId: farm._id,
          farmName: farm?.name,
          fromDate,
          toDate, // نعرض للمستخدم نهاية الفترة المختارة كما اختارها (شاملة)
          quote: data.totalPrice,
          userId: currentUser._id,
          userName: currentUser.name
        }
      });

    } catch (err) {
      Alert.alert('خطأ', err.response?.data?.message || 'تعذّر حساب السعر');
    }
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
            {/* Calendar */}
            <Calendar
              markingType={'period'}
              markedDates={markedDates}
              onDayPress={onDayPress}
              minDate={new Date().toISOString().split('T')[0]} // منع اختيار الأيام السابقة
            />

            {quote && (
              <Text style={{ fontSize: 18, color: "#0077b6", fontWeight: "bold", marginVertical: 10 }}>
                السعر الكلي: {quote} $
              </Text>
            )}

            {/* أزرار الحجز */}
            <View style={styles.bookingButtonsContainer}>
              {/* زر حجز يوم واحد */}
              <TouchableOpacity
                style={[styles.bookButton, styles.singleDayButton]}
                onPress={handleSingleDayBooking}
                disabled={!fromDate}
              >
                <Text style={styles.bookButtonText}>
                  حجز يوم واحد
                </Text>
              </TouchableOpacity>

              {/* زر حجز عدة أيام */}
              <TouchableOpacity
                style={[styles.bookButton, styles.multiDayButton]}
                onPress={handleMultiDayBooking}
                disabled={!fromDate || !toDate}
              >
                <Text style={styles.bookButtonText}>
                  حجز عدة أيام
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.bookButton} onPress={() => Linking.openURL(`https://wa.me/963949599136`)}>
            <Text style={styles.bookButtonText}>تواصل</Text>
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
  bookingBox: { width: '100%', marginTop: 20, alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#0077b6', marginTop: 15, marginBottom: 5 },
  extraDetails: { width: '100%', padding: 10, backgroundColor: '#d0f0fd', borderRadius: 10, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  detailText: { fontSize: 16, color: '#0077b6' },
  bookingButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  singleDayButton: {
    flex: 1,
    backgroundColor: '#28a745', // لون أخضر لليوم الواحد
  },
  multiDayButton: {
    flex: 1,
    backgroundColor: '#0077b6', // لون أزرق لعدة أيام
  },
  bookButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
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
