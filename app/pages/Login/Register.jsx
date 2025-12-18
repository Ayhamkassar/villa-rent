import { API_URL } from '@/server/config';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient'; // 👈 استدعاء المكتبة
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('تحذير', 'يرجى ملء جميع الحقول');
      return;
    }
  
    if (!isEmailValid(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
  
    if (!isPasswordValid(password)) {
      Alert.alert(
        'خطأ',
        'كلمة المرور يجب أن تكون على الأقل 8 محارف وتحتوي على حرف كبير وحرف صغير ورقم'
      );
      return;
    }
  
    try {
      setLoading(true);
  
      await axios.post(`${API_URL}/api/register`, {
        name,
        email,
        password,
      });
  
      Alert.alert('تم', 'تم إنشاء الحساب بنجاح');
      router.replace('/pages/Login/Login');
    } catch (error) {
      Alert.alert(
        'خطأ',
        error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب'
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <LinearGradient
      colors={['#6dd5ed', '#2193b0']} // 👈 متدرج لوني أزرق سماوي
      style={styles.background}
    >
      <View style={styles.formBox}>
        <Text style={styles.title}>إنشاء حساب</Text>

        <TextInput
          style={styles.input}
          placeholder="الاسم"
          placeholderTextColor="#555"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="البريد الإلكتروني"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          placeholderTextColor="#555"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

<TouchableOpacity
  style={[styles.button, loading && { opacity: 0.7 }]}
  onPress={handleRegister}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.buttonText}>إنشاء الحساب</Text>
  )}
</TouchableOpacity>


        <TouchableOpacity onPress={() => router.push('/pages/Login/Login')}>
          <Text style={styles.link}>لديك حساب؟ سجل الدخول</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    elevation: 5, // للـ Android
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
