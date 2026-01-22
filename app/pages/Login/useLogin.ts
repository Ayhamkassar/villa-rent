import { loginRequest } from '@/services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى إدخال البريد وكلمة المرور');
      return;
    }

    try {
      setLoading(true);

      const { token, user } = await loginRequest(email, password);

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('isAdmin', String(user.isAdmin || false));

      if (user.isAdmin) {
        router.replace('/pages/Admin/villas/addVilla');
      } else {
        router.replace('/pages/mainScreens/profile');
      }
    } catch (err: any) {
      Alert.alert(
        'خطأ',
        err.response?.data?.message || 'فشل تسجيل الدخول'
      );
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
