import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Modal, Linking } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { API_URL } from "@/server/config";

export default function FarmDetails() {
  const { id } = useLocalSearchParams();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [markedDates, setMarkedDates] = useState({});
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [quote, setQuote] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/farms/${id}`);
        setFarm(response.data);

      const booked = {};
      response.data.bookings?.forEach(booking => {
        const current = new Date(booking.from);
        const last = new Date(booking.to);

        while (current <= last){
          const dateStr = current.toISOString().split('T')[0];
          booked[dateStr] = {disabled : true,disableTouchEvent: true,color:'red',textColor : 'white'};
          current.setDate(current.getDate()+1)
        }
      });

      setMarkedDates(booked)
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
  };const onDayPress = (day) => {
    // لو اليوم محجوز، ما نسمح بالضغط
    if (markedDates[day.dateString]?.disabled) return;
  
    // إذا سبق الاختيار (بداية ونهاية)، وإضغط على أي يوم جديد => إعادة الاختيار
    if (fromDate && toDate) {
      setFromDate(day.dateString);
      setToDate(null);
  
      // إعادة تلوين الأيام المحجوزة فقط
      const booked = {};
      farm.bookings?.forEach(booking => {
        const current = new Date(booking.from);
        const last = new Date(booking.to);
  
        while (current <= last) {
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
        return Alert.alert('خطأ', 'الفترة المختارة تحتوي على أيام محجوزة');
      }
  
      range.forEach((date, index) => {
        if (index === 0) {
          marked[date] = { startingDay: true, color: '#0077b6', textColor: 'white' };
        } else if (index === range.length - 1) {
          marked[date] = { endingDay: true, color: '#0077b6', textColor: 'white' };
        } else {
          marked[date] = { color: '#90e0ef', textColor: 'white' };
        }
      });
  
      setMarkedDates(marked);
      setToDate(day.dateString);
    }
  };
  
  

  const handleBooking = async () => {
    if (!fromDate || !toDate) {
      return Alert.alert('خطأ', 'يرجى اختيار فترة (من – إلى) من التقويم');
    }

    try {
      const { data } = await axios.post(`${API_URL}/api/farms/quote/${id}`, {
        from: fromDate,
        to: toDate
      });

      router.push({
        pathname: '../FarmDetails/ConfirmBooking',
        params: {
          farmId: id,
          fromDate,
          toDate,
          quote: data.totalPrice
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
    <LinearGradient colors={['#a8edea', '#fed6e3']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>

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
            />

            {quote && (
              <Text style={{ fontSize: 18, color: "#0077b6", fontWeight: "bold", marginVertical: 10 }}>
                السعر الكلي: {quote} $
              </Text>
            )}

            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBooking}
            >
              <Text style={styles.bookButtonText}>حجز</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.bookButton} onPress={() => Linking.openURL(`https://wa.me/963949599136`)}>
              <Text style={styles.bookButtonText}>تواصل</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, alignItems: 'center' },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#0077b6', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginBottom: 10 },
  backText: { color: '#fff', fontWeight: 'bold' },
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
  bookButton: {
    backgroundColor: '#0077b6',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
