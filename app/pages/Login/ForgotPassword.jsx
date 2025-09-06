import { API_URL } from '@/server/config';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
  
      <View style={styles.overlay}>
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

          <TouchableOpacity onPress={() => router.push('/pages/Login/Login')}>
            <Text style={styles.link}>عودة لتسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width, height },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formBox: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
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
    marginTop: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#2980b9', textDecorationLine: 'underline' },
});
