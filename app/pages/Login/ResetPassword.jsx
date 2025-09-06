import { API_URL } from "@/server/config";
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const { width, height } = Dimensions.get('window');

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleReset = async () => {
    if (!email || !token || !newPassword) {
      return Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    }

    try {
      const res = await axios.post(`${API_URL}/api/reset-password`, {
        email,
        token,
        newPassword
      });
      Alert.alert('تم', res.data.message);
      router.push('/pages/Login/Login'); // العودة لصفحة تسجيل الدخول
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('خطأ', err.response?.data?.message || 'فشل في إعادة تعيين كلمة المرور');
    }
  };

  return (
   
      <View style={styles.overlay}>
        <View style={styles.formBox}>
          <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>

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
            placeholder="الرمز المؤقت"
            placeholderTextColor="#555"
            value={token}
            onChangeText={setToken}
          />

          <TextInput
            style={styles.input}
            placeholder="كلمة المرور الجديدة"
            placeholderTextColor="#555"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>تحديث كلمة المرور</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333', textAlign: 'center' },
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
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
