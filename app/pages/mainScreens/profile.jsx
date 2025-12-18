import { API_URL } from '@/server/config';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AnimatedScreen from '../../../components/AnimatedScreen';

export default function ProfileScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

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
      setNewEmail(res.data?.email || '');
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

        fetchUser(userId, token);
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
      Alert.alert('نجح', 'تم تحديث الاسم بنجاح');
    } catch (err) {
      Alert.alert('خطأ', err.response?.data?.message || 'فشل تحديث الاسم');
    }
  };

  const saveEmail = async () => {
    try {
      if (!newEmail?.trim()) return Alert.alert('تنبيه', 'يرجى إدخال إيميل صالح');
      
      // التحقق من صيغة الإيميل
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail.trim())) {
        return Alert.alert('تنبيه', 'يرجى إدخال إيميل صالح');
      }

      await axios.put(`${API_URL}/api/users/${userId}`, { email: newEmail.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser((u) => ({ ...u, email: newEmail.trim() }));
      setIsEditingEmail(false);
      Alert.alert('نجح', 'تم تحديث الإيميل بنجاح');
    } catch (err) {
      Alert.alert('خطأ', err.response?.data?.message || 'فشل تحديث الإيميل');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            setUser(null);
            router.replace('/pages/Login/Login');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <AnimatedScreen animationType="fadeIn" duration={300}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text>جاري التحميل...</Text>
        </View>
      </AnimatedScreen>
    );
  }

  if (!userId) {
    return (
      <AnimatedScreen animationType="scaleIn" duration={400}>
        <View style={styles.centered}>
          <Text style={styles.infoText}>أنت غير مسجل دخول</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/pages/Login/Login')}>
            <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen animationType="slideInRight" duration={600}>
      <LinearGradient
        colors={['#74ebd5', '#ACB6E5']}
        style={{ flex: 1 }}
      >
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
        {/* زر حول التطبيق */}
        <TouchableOpacity style={styles.aboutBtn} onPress={() => router.push('/pages/settings')}>
          <MaterialCommunityIcons name="dots-vertical" size={28} color="#1E90FF" />
        </TouchableOpacity>

        {/* صورة البروفايل */}
        <View style={styles.avatarContainer}>
          {user?.profileImage ? (
            <Image
              source={{ uri: `${API_URL}${user.profileImage}` }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }]}>
              <Ionicons name="person-circle-outline" size={100} color="#1E90FF" />
            </View>
          )}
          
          <TouchableOpacity style={styles.changeImageBtn} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.changeImageText}>تغيير الصورة</Text>
          </TouchableOpacity>
        </View>

        {/* معلومات المستخدم */}
        <View style={styles.userInfoContainer}>
          {/* الاسم */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>الاسم</Text>
            {isEditingName ? (
              <View style={styles.editRow}>
                <TextInput 
                  style={styles.textInput} 
                  value={newName} 
                  onChangeText={setNewName}
                  placeholder="أدخل اسمك"
                />
                <TouchableOpacity style={styles.saveBtn} onPress={saveName}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => { 
                    setIsEditingName(false); 
                    setNewName(user?.name || ''); 
                  }}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.displayRow}>
                <Text style={styles.fieldValue}>{user?.name || 'غير محدد'}</Text>
                <TouchableOpacity 
                  style={styles.editBtn} 
                  onPress={() => setIsEditingName(true)}
                >
                  <Ionicons name="pencil" size={20} color="#1E90FF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* الإيميل */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>البريد الإلكتروني</Text>
            {isEditingEmail ? (
              <View style={styles.editRow}>
                <TextInput 
                  style={styles.textInput} 
                  value={newEmail} 
                  onChangeText={setNewEmail}
                  placeholder="أدخل إيميلك"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.saveBtn} onPress={saveEmail}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => { 
                    setIsEditingEmail(false); 
                    setNewEmail(user?.email || ''); 
                  }}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.displayRow}>
                <Text style={styles.fieldValue}>{user?.email || 'غير محدد'}</Text>
                <TouchableOpacity 
                  style={styles.editBtn} 
                  onPress={() => setIsEditingEmail(true)}
                >
                  <Ionicons name="pencil" size={20} color="#1E90FF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* زر تسجيل الخروج الطويل */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutBtnText}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </ScrollView>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  aboutBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#1E90FF',
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  changeImageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  fieldContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  fieldValue: {
    fontSize: 18,
    color: '#555',
    flex: 1,
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  editBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f8ff',
  },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '100%',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
