import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import { styles } from './login.styles';
import { useLogin } from './useLogin';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useLogin();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoBox} />

      <Text style={styles.title}>تسجيل الدخول</Text>
      <Text style={styles.subtitle}>مرحباً بعودتك 👋</Text>

      <AuthInput
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <AuthInput
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => router.push('/pages/Login/ForgotPasswordScreen')}>
        <Text style={styles.forgot}>نسيت كلمة المرور؟</Text>
      </TouchableOpacity>

      <AuthButton
        title="تسجيل الدخول"
        loading={loading}
        onPress={() => login(email, password)}
      />

      <Text style={styles.divider}>أو</Text>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => router.push('/pages/Login/RegisterScreen')}
      >
        <Text>إنشاء حساب جديد</Text>
      </TouchableOpacity>
    </View>
  );
}
