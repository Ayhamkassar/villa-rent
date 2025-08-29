import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '@/server/config'

export default function ConfirmBooking() {
  const router = useRouter();
  const { farmId, fromDate, toDate, quote } = useLocalSearchParams(); // هالطريقة صحيحة مع Expo Router

  const formatDate = (date) => new Date(date).toISOString().split('T')[0];

  const handleConfirm = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return Alert.alert('خطأ', 'يجب تسجيل الدخول للحجز');

    try {
      await axios.post(`${API_URL}/api/farms/book/${farmId}`, {
        userId,
        from: formatDate(fromDate),
        to: formatDate(toDate)
      });
      Alert.alert('تم', 'تم الحجز بنجاح');
      router.replace('/'); // ترجع للصفحة الرئيسية أو أي صفحة تحب
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', err.response?.data?.message || 'فشل في الحجز');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تأكيد الحجز</Text>
      <Text style={styles.text}>
  تاريخ البداية: {new Date(fromDate).toLocaleDateString()} {new Date(fromDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</Text>

<Text style={styles.text}>
  تاريخ النهاية: {new Date(toDate).toLocaleDateString()} {new Date(toDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</Text>

      <Text style={styles.text}>السعر الإجمالي: {quote || '-'}</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>تأكيد الحجز</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:26, fontWeight:'bold', marginBottom:20 },
  text: { fontSize:18, marginBottom:10 },
  confirmButton: { backgroundColor:'#0077b6', padding:15, borderRadius:10, marginTop:20 },
  confirmButtonText: { color:'#fff', fontSize:18, fontWeight:'bold' },
});
