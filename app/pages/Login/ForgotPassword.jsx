import { API_URL } from '@/server/config';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient'; // 👈 خلفية متدرجة
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // نسيت كلمة المرور
  const handleForgotPassword = async () => {
    if (!email) {
      return Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/forgot-password`, { email });
      const token = res.data.token;

      Alert.alert('تم', 'أرسلنا لك بريد يحوي رمز مكون من ثمانية أحرف');
      setEmail('');
      router.push(`/pages/Login/ResetPassword?token=${token}`);
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', err.response?.data?.message || 'حدث خطأ أثناء إرسال البريد');
    } finally {
      setLoading(false);
    }
  };

  // إعادة إرسال رمز تفعيل الحساب
  const handleResendActivation = async () => {
    if (!email) {
      return Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني لإعادة الإرسال');
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/resend-activation`, { email });
      Alert.alert('تم', 'تم إرسال رمز تفعيل جديد إلى بريدك الإلكتروني');
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', err.response?.data?.message || 'حدث خطأ أثناء إعادة إرسال الرمز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#36d1dc', '#5b86e5']} // 👈 ألوان خلفية متدرجة (أزرق-سماوي)
      style={styles.background}
    >
      <View style={styles.formBox}>
        <Text style={styles.title}>استعادة كلمة المرور</Text>

        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'جاري الإرسال...' : 'إرسال رابط'}</Text>
        </TouchableOpacity>

        {/* 👇 كبسة إعادة إرسال رمز التفعيل */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#e67e22' }]} onPress={handleResendActivation} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'جاري الإرسال...' : 'إعادة إرسال رمز التفعيل'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/pages/Login/Login')}>
          <Text style={styles.link}>عودة لتسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBox: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 12,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#2980b9', textDecorationLine: 'underline' },
});
