import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      try {
        const isAdmin = await AsyncStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
          router.replace('/pages/Admin/villas/addVilla');
        } else {
          router.replace('/pages/mainScreens/FarmListScreen');
        }
      } catch (err) {
        // fallback: go to FarmListScreen
        router.replace('/pages/mainScreens/FarmListScreen');
      }
    };
    checkRoleAndRedirect();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' }}>
      <ActivityIndicator size="large" color="#2ecc71" />
    </View>
  );
}
