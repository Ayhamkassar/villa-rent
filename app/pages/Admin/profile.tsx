import AnimatedScreen from '@/components/AnimatedScreen';
import BottomNav from '@/components/BottomNav';
import ProfileAvatar from '@/components/ProfileAvatar';
import { ProfileField } from '@/components/ProfileField';
import ProfileHeader from '@/components/ProfileHeader';
import { useProfile } from '@/hooks/useProfile';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, loading, update, refresh, refreshing, logout } = useProfile();

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // ✅ اختيار صورة
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      update({ profileImage: imageUri }); // لاحقاً upload
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <AnimatedScreen animationType="slideInRight">
      <LinearGradient colors={['#74EBD5', '#ACB6E5']} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={['#1E90FF']}
            />
          }
        >

          {/* ===== HEADER ===== */}
          <ProfileHeader
            onSettingsPress={() => router.push('/pages/settings')}
          />

          {/* ===== AVATAR ===== */}
          <ProfileAvatar
            image={user?.profileImage}
            onChangeImage={pickImage}
          />

          {/* ===== NAME ===== */}
          <ProfileField
            label="الاسم"
            value={editName ? name : user?.name || ''}
            editing={editName}
            onEdit={() => {
              setName(user?.name || '');
              setEditName(true);
            }}
            onSave={() => {
              if (!name.trim()) return;
              update({ name: name.trim() });
              setEditName(false);
            }}
            onCancel={() => {
              setName(user?.name || '');
              setEditName(false);
            }}
            onChange={setName}
          />

          {/* ===== EMAIL ===== */}
          <ProfileField
            label="البريد الإلكتروني"
            value={editEmail ? email : user?.email || ''}
            editing={editEmail}
            onEdit={() => {
              setEmail(user?.email || '');
              setEditEmail(true);
            }}
            onSave={() => {
              if (!email.trim()) return;
              update({ email: email.trim() });
              setEditEmail(false);
            }}
            onCancel={() => {
              setEmail(user?.email || '');
              setEditEmail(false);
            }}
            onChange={setEmail}
          />

          {/* ===== PHONE (READ ONLY) ===== */}
          <ProfileField
            label="رقم الهاتف"
            value={user?.phone || '—'}
            readOnly
          />

          {/* ===== LOCATION ===== */}
          <ProfileField
            label="الموقع"
            value={user?.location || 'دمشق، سوريا'}
            readOnly
          />

          {/* ===== LOGOUT ===== */}
          <ProfileField
            label="تسجيل الخروج"
            danger
            onPress={() =>
              Alert.alert(
                'تسجيل الخروج',
                'هل أنت متأكد؟',
                [
                  { text: 'إلغاء', style: 'cancel' },
                  {
                    text: 'تسجيل الخروج',
                    style: 'destructive',
                    onPress: logout,
                  },
                ]
              )
            }
          />

        </ScrollView>

        <BottomNav />
      </LinearGradient>
    </AnimatedScreen>
  );
}
