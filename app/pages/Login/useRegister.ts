import { registerRequest } from '@/services/auth.service';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    try {
      setLoading(true);
      await registerRequest(name, email, password);
      Alert.alert('تم', 'تم إنشاء الحساب بنجاح');
      router.replace('/pages/Login/LoginScreen');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب'
      );
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
