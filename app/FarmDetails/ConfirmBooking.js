import { API_URL } from '@/server/config';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfirmBooking() {
  const router = useRouter();
  const { farmId, fromDate, toDate, quote, farmName, userId, userName } = useLocalSearchParams();

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const handleConfirm = async () => {
    console.log(farmId,userId,fromDate,toDate)
    if (!farmId || !userId || !fromDate || !toDate) {
      return Alert.alert('خطأ', 'الرجاء التأكد من جميع بيانات الحجز');
    }

    try {
      // إرسال طلب الحجز مرة واحدة فقط
      await axios.post(`${API_URL}/api/farms/book/${farmId}`, {
        from: fromDate,
        to: toDate,
        userId,
        userName,
      });

      Alert.alert('نجاح', 'تم إرسال طلب الحجز بنجاح');

      const message = `✅ تم إرسال طلب حجز جديد\n\n👤 المستخدم: ${userName || 'غير معروف'}\n🏡 الفيلا: ${farmName || 'غير معروف'}\n📅 من: ${formatDate(fromDate)}\n📅 إلى: ${formatDate(toDate)}\n💰 السعر: ${quote || '-'}\n\nالرجاء تأكيد الحجز.`;
      const url = `https://wa.me/963981834818?text=${encodeURIComponent(message)}`;
      Linking.openURL(url);
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', err.response?.data?.message || 'فشل في الحجز');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>◀ رجوع</Text>
      </TouchableOpacity>

      <Text style={styles.title}>تأكيد الحجز</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>المستخدم:</Text>
        <Text style={styles.cardValue}>{userName || 'غير معروف'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>الفيلا:</Text>
        <Text style={styles.cardValue}>{farmName || '-'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>تاريخ البداية:</Text>
        <Text style={styles.cardValue}>{formatDate(fromDate)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>تاريخ النهاية:</Text>
        <Text style={styles.cardValue}>{formatDate(toDate)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>السعر الإجمالي:</Text>
        <Text style={styles.cardValue}>{quote || '-'}</Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>تأكيد الحجز عبر واتساب</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 20, alignItems: 'center' },
  backButton: { alignSelf: 'flex-start', marginBottom: 10 },
  backButtonText: { fontSize: 16, color: '#0077b6', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, color: '#0077b6' },
  card: { 
    width: '100%', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4,
    elevation: 3
  },
  cardLabel: { fontSize: 16, color: '#555', marginBottom: 5 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  confirmButton: { 
    marginTop: 20, 
    backgroundColor: '#25D366', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 12, 
    width: '100%', 
    alignItems: 'center' 
  },
  confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
