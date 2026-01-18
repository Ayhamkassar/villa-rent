import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/server/config';
import BottomNav from '../../../../components/BottomNav';

export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // حالة الـ Refresh

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // افترض أنك خزنت التوكن عند تسجيل الدخول
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const confirmAndDeleteUser = async (userId) => {
    Alert.alert('تأكيد', 'هل تريد حذف هذا المستخدم؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف', style: 'destructive', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            await axios.delete(`${API_URL}/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers((prev) => prev.filter((u) => u._id !== userId));
          } catch (err) {
            const msg = err.response?.data?.message || err.message || 'فشل حذف المستخدم';
            Alert.alert('خطأ', msg);
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.viewButton} onPress={() => router.push({ pathname: '/pages/Admin/users/UserDetails', params: { id: item._id } })}>
          <Text style={styles.viewText}>عرض</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmAndDeleteUser(item._id)}>
          <Text style={styles.deleteText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>قائمة المستخدمين</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}      // لون الـ spinner على Android
            tintColor="#4CAF50"        // لون الـ spinner على iOS
            title="جارٍ التحديث..."    // نص على iOS
            titleColor="#4CAF50"
          />
        }
      />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  email: { fontSize: 14, color: '#555', marginVertical: 5 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  viewButton: { backgroundColor: '#3498db', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  viewText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  deleteText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
