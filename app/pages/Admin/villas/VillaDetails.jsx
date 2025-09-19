import { API_URL } from '@/server/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AnimatedScreen from '../../../../components/AnimatedScreen';

export default function VillaDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [villa, setVilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/farms/${id}`);
        
        setVilla(data);
      } catch (err) {
        Alert.alert('خطأ', 'تعذر تحميل بيانات المزرعة');
        router.back();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    setBookingsLoading(true);
    axios.get(`${API_URL}/api/bookings/${id}`)
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077b6" />
      </View>
    );
  }

  const images = Array.isArray(villa?.images) ? villa.images : [];

  return (
    <AnimatedScreen animationType="scaleIn" duration={500}>
      <LinearGradient colors={['#a8edea', '#fed6e3']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {images.map((imgUri, index) => (
              <Image key={index} source={{ uri: `${API_URL}/api/images/${imgUri}` }} style={styles.image} />
            ))}
          </ScrollView>
        )}

        <Text style={styles.title}>{villa?.name || '...'}</Text>

        <Text style={[styles.sectionTitle, { alignSelf: 'flex-end' }]}>الوصف</Text>
        <Text style={styles.description}>{villa?.description || '...'}</Text>

        <Text style={styles.status}>الحالة: {villa?.status || '...'}</Text>
        <Text style={styles.type}>نوع المزرعة: {villa?.type === 'sale' ? 'بيع' : 'إيجار'}</Text>
        <Text style={styles.address}>العنوان: {villa?.address?.address || villa?.address || 'غير محدد'}</Text>

        <Text style={[styles.sectionTitle, { alignSelf: 'flex-end' }]}>التفاصيل الإضافية</Text>
        <View style={styles.extraDetails}>
          {villa?.type === 'rent' ? (
            <>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="account-group" size={24} color="#0077b6" />
                <Text style={styles.detailText}>عدد الضيوف: {villa?.guests || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="bed-king-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>غرف النوم: {villa?.bedrooms || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="shower" size={24} color="#0077b6" />
                <Text style={styles.detailText}>الحمامات: {villa?.bathrooms || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar" size={24} color="#0077b6" />
                <Text style={styles.detailText}>سعر منتصف الأسبوع: {villa?.midweekPrice || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar-weekend" size={24} color="#0077b6" />
                <Text style={styles.detailText}>سعر نهاية الأسبوع: {villa?.weekendPrice || '-'}</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="currency-usd" size={24} color="#0077b6" />
                <Text style={styles.detailText}>السعر: {villa?.price || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="ruler" size={24} color="#0077b6" />
                <Text style={styles.detailText}>المساحة (هكتار): {villa?.sizeInHectares || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="account-group" size={24} color="#0077b6" />
                <Text style={styles.detailText}>عدد الضيوف: {villa?.guests || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="bed-king-outline" size={24} color="#0077b6" />
                <Text style={styles.detailText}>غرف النوم: {villa?.bedrooms || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="shower" size={24} color="#0077b6" />
                <Text style={styles.detailText}>الحمامات: {villa?.bathrooms || '-'}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {/* Bookings Section */}
      {villa?.type === 'rent' && (
  <View style={styles.bookingsSection}>
    <Text style={styles.sectionTitle}>📅 الحجوزات</Text>

    {bookingsLoading ? (
      <ActivityIndicator size="small" color="#0077b6" style={{ marginVertical: 10 }} />
    ) : bookings.length === 0 ? (
      <Text style={styles.noBookingsText}>لا يوجد حجوزات لهذه المزرعة</Text>
    ) : (
      bookings.map((booking, idx) => (
        <View key={booking._id || idx} style={styles.bookingCard}>
          <Text style={styles.bookingName}>
            👤 الحجز بواسطة: {booking.userName || booking.user?.name || 'غير معروف'}
          </Text>
          <Text style={styles.bookingDate}>
            🗓 من: {booking.from ? new Date(booking.from).toLocaleDateString('ar-SY') : '-'}
            {"\n"}إلى: {booking.to ? new Date(booking.to).toLocaleDateString('ar-SY') : '-'}
          </Text>
          {booking.status && (
            <Text style={[styles.bookingStatus, 
              booking.status === 'confirmed' ? { color: 'green' } : 
              booking.status === 'pending' ? { color: 'orange' } : { color: 'red' }
            ]}>
              الحالة: {booking.status === 'confirmed' ? 'مؤكد' : 
                      booking.status === 'pending' ? 'في الانتظار' : 
                      booking.status === 'cancelled' ? 'ملغي' : booking.status}
            </Text>
          )}
        </View>
      ))
    )}
  </View>
    )}
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
  title: { fontSize: 26, fontWeight: 'bold', color: '#0077b6', marginBottom: 10 },
  type: { fontSize: 18, marginBottom: 5 },
  status: { fontSize: 18, marginBottom: 5 },
  address: { fontSize: 16, fontStyle: 'italic', marginBottom: 15 },
  description: { fontSize: 18, color: '#333', textAlign: 'center', lineHeight: 26, marginBottom: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#0077b6', marginTop: 15, marginBottom: 5 },
  extraDetails: { width: '100%', padding: 10, backgroundColor: '#d0f0fd', borderRadius: 10, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  detailText: { fontSize: 16, color: '#0077b6' },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#0077b6', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginBottom: 10 },
  backText: { color: '#fff', fontWeight: 'bold' },
  bookingCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookingName: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#0077b6' },
  bookingDate: { fontSize: 15, color: '#333', marginBottom: 4 },
  bookingStatus: { fontSize: 15, fontWeight: 'bold' },
  
});


