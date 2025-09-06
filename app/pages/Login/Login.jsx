import { API_URL } from '@/server/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('خطأ', 'يرجى إدخال البريد وكلمة المرور');
    }

    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      const { token, user } = res.data;
      console.log(user.id)
      // تخزين البيانات محلياً
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('isAdmin', (user.isAdmin || false).toString());

      // التوجيه حسب الصلاحية
      if (user.isAdmin) {
        router.replace('/pages/Admin/villas/addVilla');
      } else {
        router.replace('/pages/mainScreens/profile');
      }

    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert('خطأ', err.response?.data?.message || 'فشل تسجيل الدخول، تحقق من البريد وكلمة المرور.');
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/loginbg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.formBox}>
          <Text style={styles.title}>تسجيل دخول</Text>

          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => router.push('/pages/Login/ForgotPassword')}>
            <Text style={styles.forgotLink}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>دخول</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/pages/Login/Register')}>
            <Text style={styles.link}>ليس لديك حساب؟ أنشئ واحد الآن</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

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
  forgotLink: {
    color: '#e74c3c',
    textDecorationLine: 'underline',
    marginBottom: 12,
    alignSelf: 'flex-start',
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
