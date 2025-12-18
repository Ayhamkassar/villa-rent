import { API_URL } from '@/server/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedScreen from '../../../components/AnimatedScreen';

export default function VillaDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [villa, setVilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [showBookings, setShowBookings] = useState(true);

  // === جلب بيانات الفيلّا ===
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

  // === دالة جلب الحجوزات ===
  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/bookings/${id}`);
      setBookings(res.data);
    } catch (err) {
      console.log('Error fetching bookings:', err.message);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBookings();
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
    <AnimatedScreen animationType="fadeIn" duration={500}>
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
        <Text style={styles.address}>رقم الهاتف: {villa?.contactNumber || '-'}</Text>

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
        <TouchableOpacity
        onPress={() => setShowBookings(v => !v)}
          style={{
              backgroundColor: '#0077b6',
              padding: 10,
              borderRadius: 8,
              marginVertical: 10,
              alignSelf: 'center'
           }}
        >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
           {showBookings ? 'إخفاء الحجوزات' : 'إظهار الحجوزات'}
        </Text>
      </TouchableOpacity>
      {/* Bookings Section */}
      {showBookings && villa?.type === 'rent' && (
        <>
        <ScrollView style={styles.bookingsSection}>
          <Text style={styles.sectionTitle}>الحجوزات</Text>
          {bookingsLoading ? (
            <ActivityIndicator size="small" color="#0077b6" style={{ marginVertical: 10 }} />
          ) : bookings.length === 0 ? (
            <Text style={styles.noBookingsText}>لا يوجد حجوزات لهذه المزرعة</Text>
          ) : (
            bookings.map((booking, idx) => (
              <View key={booking._id || idx} style={styles.bookingItem}>
                <Text style={styles.bookingText}>
                  الحجز بواسطة: {booking.userName || booking.userId?.name || '-'}
                </Text>
                <Text style={styles.bookingText}>
                  من: {booking.from ? new Date(booking.from).toLocaleDateString() : '-'} 
                  إلى: {booking.to ? (() => { const d = new Date(booking.to); d.setDate(d.getDate() - 1); return d.toLocaleDateString(); })() : '-'}
                </Text>
                <Text style={[styles.bookingText, 
                  booking.status === 'confirmed' ? { color: 'green' } : 
                  booking.status === 'pending' ? { color: 'orange' } : { color: 'red' }
                ]}>
                  الحالة: {booking.status === 'confirmed' ? 'مؤكد' : 
                          booking.status === 'pending' ? 'في الانتظار' : 
                          booking.status === 'cancelled' ? 'ملغي' : booking.status}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                  {booking.status === 'pending' && (
                    <TouchableOpacity
                      style={styles.confirmButton}
                      onPress={async () => {
                        try {
                          await axios.put(`${API_URL}/api/bookings/${booking._id}/status`, {
                            status: 'confirmed'
                          });
                          Alert.alert('تم تأكيد الحجز');
                          await fetchBookings();
                        } catch (err) {
                          Alert.alert('خطأ', 'فشل في تأكيد الحجز');
                        }
                      }}
                    >
                      <Text style={styles.confirmButtonText}>تأكيد الحجز</Text>
                    </TouchableOpacity>
                  )}

                  {booking.status !== 'cancelled' && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={async () => {
                        try {
                          await axios.put(`${API_URL}/api/bookings/${booking._id}/status`, {
                            status: 'cancelled'
                          });
                          Alert.alert('تم إلغاء الحجز');
                          await fetchBookings();
                        } catch (err) {
                          Alert.alert('خطأ', 'فشل في إلغاء الحجز');
                        }
                      }}
                    >
                      <Text style={styles.cancelButtonText}>إلغاء الحجز</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </>
      )}
      </View>
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
  bookingsSection: { width: '100%', marginTop: 10, marginBottom: 30, backgroundColor: '#f0f4f8', borderRadius: 10, padding: 12 },
  bookingItem: { borderBottomWidth: 1, borderColor: '#e0e0e0', paddingVertical: 8 },
  bookingText: { fontSize: 15, color: '#333' },
  noBookingsText: { color: '#888', textAlign: 'center', marginVertical: 10 },
  confirmButton: {
    backgroundColor: '#2a9d8f',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#e63946',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' }
});
