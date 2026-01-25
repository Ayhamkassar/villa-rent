import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight,
  Bell,
  Globe,
  HelpCircle,
  Info,
  Mail,
  Settings,
  Share2,
  Trash2,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LanguageSelector } from '../../components/LanguageSelector';
import { SettingsRow } from '../../components/SettingsRow';
import { ToggleSwitch } from '../../components/ToggleSwitch';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'ar' | 'en'>('ar');

  const handleContactSupport = () => {
    Alert.alert('تواصل مع الدعم الفني', 'سيتم فتح صفحة الدعم الفني');
  };

  const handleShareApp = () => {
    Alert.alert(
      'مشاركة التطبيق',
      'جرب هذا التطبيق الرائع لتأجير المزارع والفلل!'
    );
    // في React Native يمكنك استخدام Share API إذا حاب
    // import { Share } from 'react-native';
    // Share.share({ message: 'تطبيق تأجير المزارع: https://your-app-link.com' });
  };

  const handleAboutApp = () => {
    Alert.alert('حول التطبيق', 'الإصدار: 1.0.0\nتطبيق تأجير المزارع والفلل');
  };

  const handleAboutDeveloper = () => {
    Alert.alert('حول المطور', 'تطوير: فريق التطوير\nالموقع: example.com');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'حذف الحساب',
      'هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => Alert.alert('تم حذف الحساب بنجاح'),
        },
      ]
    );
  };

  const handleBack = () => {
    Alert.alert('رجوع', 'العودة للصفحة السابقة');
  };

  return (
    <LinearGradient
      colors={['#74ebd5', '#ACB6E5']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Settings width={36} height={36} color="#0077b6" />
        <Text style={styles.headerTitle}>الإعدادات</Text>
      </View>
      <Text style={styles.headerSubtitle}>إدارة إعدادات التطبيق والحساب</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Notifications */}
        <SettingsRow
          icon={<Bell width={24} height={24} color="#0077b6" />}
          label="تفعيل الإشعارات"
          rightContent={
            <ToggleSwitch
              enabled={notificationsEnabled}
              onChange={setNotificationsEnabled}
            />
          }
        />

        {/* Language Selection */}
        <SettingsRow
          icon={<Globe width={24} height={24} color="#0077b6" />}
          label="اللغة"
          rightContent={
            <LanguageSelector
              selected={selectedLanguage}
              onChange={setSelectedLanguage}
            />
          }
        />

        {/* Divider */}
        <View style={{ height: 16 }} />

        {/* Contact Support */}
        <SettingsRow
          icon={<Mail width={24} height={24} color="#0077b6" />}
          label="تواصل مع الدعم الفني"
          showChevron
          onPress={handleContactSupport}
        />

        {/* Share App */}
        <SettingsRow
          icon={<Share2 width={24} height={24} color="#0077b6" />}
          label="مشاركة التطبيق"
          showChevron
          onPress={handleShareApp}
        />

        {/* About App */}
        <SettingsRow
          icon={<Info width={24} height={24} color="#0077b6" />}
          label="حول التطبيق"
          showChevron
          onPress={handleAboutApp}
        />

        {/* About Developer */}
        <SettingsRow
          icon={<HelpCircle width={24} height={24} color="#0077b6" />}
          label="حول المطور"
          showChevron
          onPress={handleAboutDeveloper}
        />

        {/* Divider */}
        <View style={{ height: 16 }} />

        {/* Delete Account */}
        <SettingsRow
          icon={<Trash2 width={24} height={24} color="#e63946" />}
          label="حذف الحساب"
          showChevron
          onPress={handleDeleteAccount}
          variant="danger"
        />
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={()=> {
                const isAdmin = AsyncStorage.getItem('isAdmin');
        if (!isAdmin){
        router.replace('/pages/mainScreens/profile')
        }
        else
        {
        router.replace('/pages/Admin/profile')
        }
        }}>
        <ArrowRight width={20} height={20} color="#fff" />
        <Text style={styles.backButtonText}>رجوع</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 30, gap: 10 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#0077b6' },
  headerSubtitle: { fontSize: 14, color: '#333', marginVertical: 8, marginLeft: 40 },
  content: { paddingVertical: 16, gap: 12 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0077b6',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
  },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
