import { API_URL } from '@/server/config';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfirmBooking() {
  const router = useRouter();
  const { farmId, fromDate, toDate, quote, farmName, userId, userName, nights } = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ar-SA');
  };

  const calculateNights = () => {
    if (nights) return parseInt(nights);
    if (!fromDate || !toDate) return 1;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const handleConfirm = async () => {
    if (!farmId || !userId || !fromDate) {
      return Alert.alert(
        'بيانات غير مكتملة', 
        'الرجاء العودة وإعادة اختيار التواريخ',
        [{ text: 'حسناً', onPress: () => router.back() }]
      );
    }

    setIsSubmitting(true);

    try {
      // تأكيد الإرسال باستخدام نهاية حصرية (checkout)
      const addDays = (dateStr, days) => {
        const d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
      };
      const effectiveToDate = toDate || fromDate;
      const sendTo = effectiveToDate === fromDate ? addDays(fromDate, 1) : addDays(effectiveToDate, 1);

      await axios.post(`${API_URL}/api/farms/book/${farmId}`, {
        from: fromDate,
        to: sendTo,
        userId,
        userName,
      });

      // إرسال رسالة واتساب
      const nightsCount = calculateNights();
      const message = `✅ *طلب حجز جديد*\n\n👤 *المستخدم:* ${userName || 'غير معروف'}\n🏡 *الفيلا:* ${farmName || 'غير معروف'}\n📅 *من:* ${formatShortDate(fromDate)}\n📅 *إلى:* ${formatShortDate(effectiveToDate)}\n🌙 *عدد الليالي:* ${nightsCount}\n💰 *السعر الإجمالي:* ${quote || '-'} $\n\nالرجاء تأكيد الحجز.`;
      const url = `https://wa.me/963981834818?text=${encodeURIComponent(message)}`;

      Alert.alert(
        '✅ تم إرسال الطلب',
        'تم إرسال طلب الحجز بنجاح. سيتم التواصل معك قريباً لتأكيد الحجز.',
        [
          { text: 'العودة للرئيسية', onPress: () => router.push('/pages/mainScreens/FarmListScreen') },
          { text: 'إرسال عبر واتساب', onPress: () => Linking.openURL(url), style: 'default' },
        ]
      );
    } catch (err) {
      console.error('خطأ في إرسال الحجز:', err);
      
      const errorMessage = err.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب';
      
      Alert.alert(
        'خطأ في الحجز',
        errorMessage,
        [
          { text: 'إعادة المحاولة', onPress: () => handleConfirm() },
          { text: 'العودة', style: 'cancel' },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nightsCount = calculateNights();

  return (
    <LinearGradient colors={['#a8edea', '#fed6e3']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0077b6" />
          <Text style={styles.backButtonText}>رجوع</Text>
        </TouchableOpacity>

        {/* العنوان */}
        <View style={styles.headerContainer}>
          <Ionicons name="checkmark-circle" size={50} color="#0077b6" />
          <Text style={styles.title}>تأكيد الحجز</Text>
          <Text style={styles.subtitle}>راجع تفاصيل حجزك قبل التأكيد</Text>
        </View>

        {/* بطاقة التفاصيل */}
        <View style={styles.detailsCard}>
          {/* الفيلا */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <MaterialCommunityIcons name="home-variant" size={24} color="#0077b6" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>الفيلا</Text>
              <Text style={styles.detailValue}>{farmName || '-'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* المستخدم */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="person" size={24} color="#0077b6" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>المستخدم</Text>
              <Text style={styles.detailValue}>{userName || 'غير معروف'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* التواريخ */}
          <View style={styles.datesContainer}>
            <View style={styles.dateBox}>
              <Ionicons name="calendar" size={20} color="#28a745" />
              <Text style={styles.dateLabel}>تاريخ الوصول</Text>
              <Text style={styles.dateValue}>{formatShortDate(fromDate)}</Text>
            </View>
            <View style={styles.dateArrow}>
              <Ionicons name="arrow-forward" size={24} color="#0077b6" />
            </View>
            <View style={styles.dateBox}>
              <Ionicons name="calendar" size={20} color="#e74c3c" />
              <Text style={styles.dateLabel}>تاريخ المغادرة</Text>
              <Text style={styles.dateValue}>{formatShortDate(toDate || fromDate)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* عدد الليالي */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="moon" size={24} color="#0077b6" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>عدد الليالي</Text>
              <Text style={styles.detailValue}>{nightsCount} {nightsCount === 1 ? 'ليلة' : 'ليالي'}</Text>
            </View>
          </View>
        </View>

        {/* بطاقة السعر */}
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>السعر الإجمالي</Text>
          <Text style={styles.priceValue}>{quote || '0'} $</Text>
        </View>

        {/* ملاحظة */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color="#666" />
          <Text style={styles.noteText}>
            سيتم إرسال طلب الحجز وسيتواصل معك فريقنا لتأكيد الحجز وترتيب الدفع.
          </Text>
        </View>

        {/* زر التأكيد */}
        <TouchableOpacity 
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]} 
          onPress={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.confirmButtonText}>تأكيد الحجز</Text>
            </>
          )}
        </TouchableOpacity>

        {/* زر الإلغاء */}
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>إلغاء والعودة</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { 
    padding: 20, 
    alignItems: 'center',
    minHeight: '100%',
  },
  backButton: { 
    alignSelf: 'flex-start', 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
    padding: 5,
  },
  backButtonText: { 
    fontSize: 16, 
    color: '#0077b6', 
    fontWeight: 'bold' 
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 10,
    color: '#0077b6' 
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  detailsCard: { 
    width: '100%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  detailIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: { 
    fontSize: 12, 
    color: '#999',
    marginBottom: 2,
  },
  detailValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
  },
  dateArrow: {
    paddingHorizontal: 10,
  },
  dateLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  priceCard: {
    width: '100%',
    backgroundColor: '#28a745',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#28a745',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fff9e6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  confirmButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0077b6', 
    paddingVertical: 16, 
    paddingHorizontal: 30, 
    borderRadius: 12, 
    width: '100%',
    shadowColor: '#0077b6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  cancelButton: {
    marginTop: 15,
    padding: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'underline',
  },
});
