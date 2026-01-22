import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import AuthButton from '@/components/auth/AuthButton';
import AuthInput from '@/components/auth/AuthInput';
import PasswordInput from '@/components/auth/PasswordInput';
import { useRouter } from 'expo-router';
import { styles } from './auth.styles';
import { useRegister } from './useRegister';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, loading, error } = useRegister();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoBox} />

      <Text style={styles.title}>إنشاء حساب</Text>
      <Text style={styles.subtitle}>أنشئ حسابك خلال ثوانٍ</Text>

      <AuthInput
        placeholder="الاسم الكامل"
        value={name}
        onChangeText={setName}
      />

      <AuthInput
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <PasswordInput
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
      />

      <PasswordInput
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <AuthButton
        title="إنشاء الحساب"
        loading={loading}
        onPress={() =>
          register(name, email, password, confirmPassword)
        }
      />

      <TouchableOpacity 
      onPress={() => router.push('/pages/Login/LoginScreen')}>
        <Text style={styles.link}>
          لديك حساب؟{' '}
          <Text style={styles.linkHighlight}>تسجيل الدخول</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
