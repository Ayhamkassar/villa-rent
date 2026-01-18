import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndRedirect = async () => {
      try {
        // أولاً: التحقق هل يوجد توكن أم لا
        const token = await AsyncStorage.getItem('token');
        if (!isMounted) return;

        // إذا لا يوجد توكن -> روح لصفحة تسجيل الدخول
        if (!token) {
          router.replace('/pages/Login/Login');
          return;
        }

        // إذا في توكن -> شوف هل هو أدمن أم مستخدم عادي
        const isAdmin = await AsyncStorage.getItem('isAdmin');
        if (!isMounted) return;

        if (isAdmin === 'true') {
          router.replace('/pages/Admin/villas/addVilla');
        } else {
          router.replace('/pages/mainScreens/FarmListScreen');
        }
      } catch (err) {
        if (!isMounted) return;
        // في حالة حصل خطأ، رجّعه لصفحة تسجيل الدخول كخيار آمن
        router.replace('/pages/Login/Login');
      }
    };

    checkAuthAndRedirect();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' }}>
      <ActivityIndicator size="large" color="#2ecc71" />
    </View>
  );
}
