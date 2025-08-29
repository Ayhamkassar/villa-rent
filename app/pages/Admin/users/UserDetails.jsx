import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/server/config';

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('تنبيه', 'الرجاء تسجيل الدخول');
          router.replace('/pages/Login/Login');
          return;
        }
        const { data } = await axios.get(`${API_URL}/api/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setUser(data);
        setNewName(data?.name || '');
      } catch (err) {
        Alert.alert('خطأ', 'تعذر تحميل بيانات المستخدم');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>رجوع</Text>
      </TouchableOpacity>
      <Text style={styles.title}>بيانات المستخدم</Text>
      <View style={styles.card}>
        <Text style={styles.label}>الاسم</Text>
        {isEditingName ? (
          <View style={styles.nameRow}>
            <TextInput style={styles.nameInput} value={newName} onChangeText={setNewName} />
            <TouchableOpacity style={styles.saveBtn} onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;
                await axios.put(`${API_URL}/api/users/${id}`, { name: newName.trim() }, { headers: { Authorization: `Bearer ${token}` } });
                setUser((u) => ({ ...u, name: newName.trim() }));
                setIsEditingName(false);
              } catch (err) {
                Alert.alert('خطأ', err.response?.data?.message || 'فشل تحديث الاسم');
              }
            }}>
              <Text style={styles.saveText}>حفظ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setIsEditingName(false); setNewName(user?.name || ''); }}>
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditingName(true)}>
            <Text style={styles.value}>{user?.name || '-'}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.label}>البريد الإلكتروني</Text>
        <Text style={styles.value}>{user?.email || '-'}</Text>
        <Text style={styles.label}>رقم الهاتف</Text>
        <Text style={styles.value}>{user?.phone || user?.contactNumber || '-'}</Text>
        <Text style={styles.label}>مدير؟</Text>
        <Text style={styles.value}>{user?.isAdmin ? 'نعم' : 'لا'}</Text>
        <Text style={styles.label}>التحقق</Text>
        <Text style={styles.value}>{user?.isVerified ? 'مفعّل' : 'غير مفعّل'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 3 },
  label: { fontSize: 14, color: '#888', marginTop: 10 },
  value: { fontSize: 16, color: '#222', marginTop: 4 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#0077b6', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginBottom: 10 },
  backText: { color: '#fff', fontWeight: 'bold' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  nameInput: { borderWidth: 1, borderColor: '#1E90FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 160, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#1E90FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#aaa', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  cancelText: { color: '#fff' },
});


