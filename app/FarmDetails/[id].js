import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, Text, TouchableOpacity } from 'react-native';

import { API_URL } from '@/server/config';
import AnimatedScreen from '../../components/AnimatedScreen';
import BookingSection from './BookingSection';
import ImageGallery from './ImageGallery';

export default function FarmDetails() {
  const { id } = useLocalSearchParams();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

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

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/farms/${id}`);
        setFarm(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'خطأ في جلب بيانات المزرعة');
      } finally {
        setLoading(false);
      }
    };
    fetchFarm();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#0077b6" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>;

  return (
    <AnimatedScreen animationType="slideInUp" duration={600}>
      <LinearGradient colors={['#a8edea', '#fed6e3']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
          <ImageGallery farm={farm} />
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#0077b6', marginBottom: 10 }}>{farm?.name || '...'}</Text>
          <Text style={{ fontSize: 16, fontStyle: 'italic', marginBottom: 15 }}>
            العنوان: {farm?.address?.fullAddress || 'غير محدد'}
          </Text>
          <Text style={{ fontSize: 18, color: '#333', textAlign: 'center', lineHeight: 26, marginBottom: 20 }}>
            {farm?.description || '...'}
          </Text>

          {farm?.type === 'rent' ? (
            <BookingSection farm={farm} currentUser={currentUser} />
          ) : (
            <TouchableOpacity style={{ backgroundColor: '#25D366', padding: 15, borderRadius: 12, flexDirection: 'row', gap: 10 }} onPress={() => Linking.openURL(`https://wa.me/963949599136`)}>
              <Text style={{ color: '#fff', fontSize: 18 }}>تواصل عبر واتساب</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={{ backgroundColor: '#0077b6', borderRadius: 10, padding: 12, marginTop: 30, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }} onPress={() => router.replace('../pages/mainScreens/FarmListScreen')}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>رجوع</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </AnimatedScreen>
  );
}
