import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, RefreshControl, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/server/config';

export default function ProfileScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem('userId');
      const savedToken = await AsyncStorage.getItem('token');
      if (id && savedToken) {
        setUserId(id);
        setToken(savedToken);
        fetchUser(id, savedToken);
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchUser = async (id, token) => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setNewName(res.data?.name || '');
    } catch (error) {
      console.error("Error fetching user:", error);
      Alert.alert("خطأ", "فشل في جلب بيانات المستخدم");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (userId && token) {
      setRefreshing(true);
      fetchUser(userId, token);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1
      });

      if (!result.canceled) {
        const formData = new FormData();
        formData.append('profileImage', {
          uri: result.assets[0].uri,
          name: 'profile.jpg',
          type: 'image/jpeg'
        });

        await axios.post(
          `${API_URL}/api/users/upload/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );

        fetchUser(userId, token); // تحديث بيانات المستخدم بعد رفع الصورة
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("خطأ", "فشل في رفع الصورة");
    }
  };

  const saveName = async () => {
    try {
      if (!newName?.trim()) return Alert.alert('تنبيه', 'يرجى إدخال اسم صالح');
      await axios.put(`${API_URL}/api/users/${userId}`, { name: newName.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser((u) => ({ ...u, name: newName.trim() }));
      setIsEditingName(false);
    } catch (err) {
      Alert.alert('خطأ', err.response?.data?.message || 'فشل تحديث الاسم');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    router.replace('/pages/Login/Login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text>جاري التحميل...</Text>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>أنت غير مسجل دخول</Text>
        <Button title="تسجيل الدخول" onPress={() => router.push('/pages/Login/Login')} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#1E90FF']}
          tintColor="#1E90FF"
          title="جارٍ التحديث..."
          titleColor="#1E90FF"
        />
      }
    >
      <Image
        source={
          user?.profileImage
            ? { uri: `${API_URL}${user.profileImage}` }
            : require('../../../assets/default-avatar.png')
        }
        style={styles.avatar}
      />
      <Button title="تغيير الصورة" onPress={pickImage} />
      {isEditingName ? (
        <View style={styles.nameRow}>
          <TextInput style={styles.nameInput} value={newName} onChangeText={setNewName} />
          <TouchableOpacity style={styles.saveBtn} onPress={saveName}><Text style={styles.saveText}>حفظ</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => { setIsEditingName(false); setNewName(user?.name || ''); }}><Text style={styles.cancelText}>إلغاء</Text></TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsEditingName(true)}>
          <Text style={styles.name}>{user?.name}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.email}>{user?.email}</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="تسجيل خروج" color="#e74c3c" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#1E90FF',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#333',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  nameInput: { borderWidth: 1, borderColor: '#1E90FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 160, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#1E90FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { backgroundColor: '#aaa', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  cancelText: { color: '#fff' },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
});
