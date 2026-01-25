import { API_URL } from '@/server/config';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
export default function BookingSection({ farm, currentUser, bookedDates = {} }) {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [quote, setQuote] = useState(null);
  const [nights, setNights] = useState(0);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const router = useRouter();

  const fetchQuote = useCallback(async (startDate, endDate) => {
    if (!startDate || !farm?._id) return;
    setIsCalculatingPrice(true);
    setPriceError(null);

    try {
      const end = new Date(endDate || startDate);
      end.setDate(end.getDate() + 1);
      const endDateString = end.toISOString().split('T')[0];

      const { data } = await axios.post(`${API_URL}/api/farms/quote/${farm._id}`, {
        from: startDate,
        to: endDateString,
      });

      setQuote(data.totalPrice);

      const diff =
        Math.ceil(
          (new Date(endDate || startDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24)
        ) || 1;
      setNights(diff);
    } catch (err) {
      setPriceError(err.response?.data?.message || 'تعذّر حساب السعر');
      setQuote(null);
    } finally {
      setIsCalculatingPrice(false);
    }
  }, [farm?._id]);

  const onDayPress = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(day.dateString);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) return Alert.alert('تنبيه', 'لا يمكن حجز أيام سابقة');

    // إذا اليوم محجوز أو معلق
    if (bookedDates[day.dateString]) {
      return Alert.alert('غير متاح', `هذا اليوم ${bookedDates[day.dateString] === 'booked' ? 'محجوز' : 'قيد الانتظار'}`);
    }

    if (!fromDate) {
      setFromDate(day.dateString);
      setToDate(null);
      updateMarkedDates(day.dateString, null);
      fetchQuote(day.dateString, day.dateString);
    } else {
      setToDate(day.dateString);
      updateMarkedDates(fromDate, day.dateString);
      fetchQuote(fromDate, day.dateString);
    }
  };

  // تحديث markedDates مع تواريخ المستخدم + الحجز والمعلق
  const updateMarkedDates = (startStr, endStr) => {
    const rangeDates = {};

    // فترة المستخدم
    if (startStr) {
      let start = new Date(startStr);
      let end = endStr ? new Date(endStr) : new Date(startStr);
      if (start > end) [start, end] = [end, start];

      while (start <= end) {
        const dateStr = start.toISOString().split('T')[0];
        rangeDates[dateStr] = {
          startingDay: dateStr === startStr,
          endingDay: dateStr === endStr,
          color: '#28a745',
          textColor: '#fff',
        };
        start.setDate(start.getDate() + 1);
      }
    }

    // تواريخ محجوزة أو معلقة
    Object.keys(bookedDates).forEach((date) => {
      rangeDates[date] = {
        color: bookedDates[date] === 'booked' ? '#ff4d4d' : '#ffd11a', // أحمر أو أصفر
        textColor: '#000',
      };
    });

    setMarkedDates(rangeDates);
  };

  const handleBooking = () => {
    if (!currentUser)
      return Alert.alert(
        'تسجيل الدخول مطلوب',
        'يرجى تسجيل الدخول لإتمام الحجز',
        [{ text: 'تسجيل الدخول', onPress: () => router.push('/pages/Login/Login') }]
      );
    if (!fromDate) return Alert.alert('اختيار التاريخ', 'يرجى اختيار تاريخ البداية');
    if (!quote) return Alert.alert('خطأ في السعر', 'تعذّر حساب السعر');

    router.push({
      pathname: '../FarmDetails/ConfirmBooking',
      params: {
        farmId: farm._id,
        farmName: farm?.name,
        fromDate,
        toDate: toDate || fromDate,
        quote,
        nights,
        userId: currentUser._id,
        userName: currentUser.name,
      },
    });
  };

  return (
    <View style={{ width: '100%', marginTop: 20, padding: 16, borderRadius: 16, backgroundColor: '#fff', gap: 15 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0077b6', textAlign: 'center' }}>📅 اختر تاريخ الحجز</Text>

      <Calendar
        markingType={'period'}
        markedDates={markedDates}
        onDayPress={onDayPress}
        minDate={new Date().toISOString().split('T')[0]}
      />

      {isCalculatingPrice && <ActivityIndicator size="large" color="#0077b6" style={{ marginTop: 10 }} />}

      {quote && !isCalculatingPrice && (
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>
          السعر الإجمالي: {quote} $ - عدد الليالي: {nights}
        </Text>
      )}

      {priceError && <Text style={{ color: 'red', marginTop: 5 }}>{priceError}</Text>}

      <TouchableOpacity
        onPress={handleBooking}
        disabled={!quote || isCalculatingPrice}
        style={{
          backgroundColor: !quote || isCalculatingPrice ? '#94d3a2' : '#28a745',
          padding: 16,
          borderRadius: 12,
          marginTop: 10,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>تأكيد الحجز</Text>
      </TouchableOpacity>
    </View>
  );
}
