import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/server/config';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Must match server rule: at least 8 chars, one lowercase, one uppercase, and one digit
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
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون على الأقل 8 محارف وتحتوي على حرف كبير وحرف صغير ورقم');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/register`, { name, email, password });
      Alert.alert('تم', 'تم إنشاء الحساب بنجاح');
      router.replace('/pages/Login/Login');
    } catch (error) {
      Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب');
    }
  };
  return (
    <ImageBackground
      source={require('../../../assets/images/register.png')}
      style={styles.background}
      resizeMode="cover"
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
  
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>إنشاء الحساب</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => router.push('/pages/Login/Login')}>
          <Text style={styles.link}>لديك حساب؟ سجل الدخول</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // يضمن التمركز
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
