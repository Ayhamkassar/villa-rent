import { API_URL } from '@/server/config';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CheckCircle, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) {
      return Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/forgot-password`, {
        email,
      });

      Alert.alert('تم', 'تم إرسال رمز إعادة التعيين');
      setSent(true);
    } catch (err: any) {
      Alert.alert(
        'خطأ',
        err.response?.data?.message || 'حدث خطأ أثناء الإرسال'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ شاشة النجاح
  if (sent) {
    return (
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
        <View style={styles.card}>
          <View style={styles.successIcon}>
            <CheckCircle size={48} color="#16a34a" />
          </View>

          <Text style={styles.title}>تم الإرسال بنجاح</Text>

          <Text style={styles.subtitle}>
            تم إرسال رمز إعادة تعيين كلمة المرور إلى:
          </Text>

          <Text style={styles.email}>{email}</Text>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => router.replace('/pages/Login/LoginScreen')}
          >
            <Text style={styles.buttonText}>العودة لتسجيل الدخول</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSent(false)}>
            <Text style={styles.link}>إعادة الإرسال</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // ✅ الشاشة الأساسية
  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Mail size={36} color="#4f46e5" />
        </View>

        <Text style={styles.title}>نسيت كلمة المرور؟</Text>

        <Text style={styles.subtitle}>
          أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة التعيين
        </Text>

        <TextInput
          placeholder="البريد الإلكتروني"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>إرسال الرمز</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>العودة لتسجيل الدخول</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },

  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  successIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  email: {
    color: '#4f46e5',
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 14,
    textAlign: 'right',
    marginBottom: 16,
  },

  mainButton: {
    backgroundColor: '#4f46e5',
    width: '100%',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  link: {
    color: '#4f46e5',
    marginTop: 10,
  },
});
