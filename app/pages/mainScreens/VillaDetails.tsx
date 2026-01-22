import { API_URL } from '@/server/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AnimatedScreen from '../../../components/AnimatedScreen';
import { BookingItem } from '../../../components/BookingItem';
import { DetailItem } from '../../../components/DetailItem';
import { ImageCarousel } from '../../../components/ImageCarousel';
import { VillaInfoCard } from '../../../components/VillaInfoCard';

interface Villa {
  _id: string;
  name: string;
  description: string;
  status: string;
  type: 'rent' | 'sale';
  address?: { address: string } | string;
  contactNumber?: string;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  midweekPrice?: number;
  weekendPrice?: number;
  price?: number;
  sizeInHectares?: number;
  images?: string[];
}

export default function VillaDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [villa, setVilla] = useState<Villa | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [showBookings, setShowBookings] = useState(true);

  const fetchVilla = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/farms/${id}`);
      setVilla(data);
    } catch {
      Alert.alert('خطأ', 'تعذر تحميل بيانات المزرعة');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/bookings/${id}`);
      setBookings(res.data);
    } catch {
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => { if (id) { fetchVilla(); fetchBookings(); } }, [id]);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0077b6" />
    </View>
  );

  const images = Array.isArray(villa?.images) ? villa.images : [];

  return (
    <AnimatedScreen animationType="fadeIn" duration={500}>
      <LinearGradient colors={['#a8edea', '#fed6e3']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>

          {images.length > 0 && <ImageCarousel images={images.map(img => `${API_URL}/api/images/${img}`)} />}

          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#0077b6', marginBottom: 10 }}>{villa?.name || '...'}</Text>

          <VillaInfoCard title="الوصف">
            <Text style={{ fontSize: 18, color: '#333', textAlign: 'center', lineHeight: 26 }}>
              {villa?.description || '...'}
            </Text>
          </VillaInfoCard>

          <VillaInfoCard title="التفاصيل الإضافية">
            {villa?.type === 'rent' ? (
              <>
                <DetailItem icon={<MaterialCommunityIcons name="account-group" size={24} color="#0077b6" />} label="عدد الضيوف" value={villa.guests || '-'} />
                <DetailItem icon={<MaterialCommunityIcons name="bed-king-outline" size={24} color="#0077b6" />} label="غرف النوم" value={villa.bedrooms || '-'} />
                <DetailItem icon={<MaterialCommunityIcons name="shower" size={24} color="#0077b6" />} label="الحمامات" value={villa.bathrooms || '-'} />
                <DetailItem icon={<MaterialCommunityIcons name="calendar" size={24} color="#0077b6" />} label="سعر منتصف الأسبوع" value={villa.midweekPrice || '-'} />
                <DetailItem icon={<MaterialCommunityIcons name="calendar-weekend" size={24} color="#0077b6" />} label="سعر نهاية الأسبوع" value={villa.weekendPrice || '-'} />
              </>
            ) : (
              <>
                <DetailItem icon={<MaterialCommunityIcons name="currency-usd" size={24} color="#0077b6" />} label="السعر" value={villa?.price || '-'} />
                <DetailItem icon={<MaterialCommunityIcons name="ruler" size={24} color="#0077b6" />} label="المساحة" value={villa?.sizeInHectares || '-'} />
              </>
            )}
          </VillaInfoCard>

          <TouchableOpacity onPress={() => setShowBookings(v => !v)} style={{ backgroundColor: '#0077b6', padding: 10, borderRadius: 8, marginVertical: 10 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              {showBookings ? 'إخفاء الحجوزات' : 'إظهار الحجوزات'}
            </Text>
          </TouchableOpacity>

          {showBookings && villa?.type === 'rent' && (
            <ScrollView style={{ width: '100%', marginTop: 10, marginBottom: 30, backgroundColor: '#f0f4f8', borderRadius: 10, padding: 12 }}>
              {bookingsLoading ? (
                <ActivityIndicator size="small" color="#0077b6" style={{ marginVertical: 10 }} />
              ) : bookings.length === 0 ? (
                <Text style={{ color: '#888', textAlign: 'center', marginVertical: 10 }}>لا يوجد حجوزات لهذه المزرعة</Text>
              ) : bookings.map((b) => <BookingItem key={b._id} booking={b} refreshBookings={fetchBookings} />)}
            </ScrollView>
          )}

        </ScrollView>
      </LinearGradient>
    </AnimatedScreen>
  );
}
