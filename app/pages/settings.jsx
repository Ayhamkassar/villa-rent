import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Share, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('ar');
  const router = useRouter();

  // مشاركة التطبيق
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'جرب تطبيق مزرعتي لسهولة حجز المزارع! https://your-app-link.com',
      });
    } catch (error) {
      Alert.alert('خطأ', 'تعذر مشاركة التطبيق');
    }
  };

  // حذف الحساب (تنفيذ وهمي)
  const handleDeleteAccount = () => {
    Alert.alert('تنبيه', 'هل أنت متأكد من حذف الحساب؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => {/* تنفيذ الحذف */} },
    ]);
  };

  // تواصل
  const handleContactEmail = () => Linking.openURL('mailto:myvilla234@email.com');

  return (
    <LinearGradient  colors={["#74ebd5", "#ACB6E5"]} style={styles.container}>
      <View style={styles.header}>
  <MaterialCommunityIcons name="cog-outline" size={36} color="#0077b6" />
  <Text style={styles.headerTitle}>الإعدادات</Text>
</View>
      {/* الإشعارات */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="bell-outline" size={24} color="#0077b6" />
        <Text style={styles.label}>تفعيل الإشعارات</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>


      {/* اللغة */}
      <View style={styles.row}>
        <Ionicons name="language-outline" size={24} color="#0077b6" />
        <Text style={styles.label}>اللغة</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={[
              styles.langButton,
              language === 'ar' && styles.langButtonActive,
            ]}
            onPress={() => setLanguage('ar')}
          >
            <Text style={styles.langText}>العربية</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.langButton,
              language === 'en' && styles.langButtonActive,
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={styles.langText}>English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.row}>
        <MaterialCommunityIcons name="email-outline" size={24} color="#0077b6" />
        <Text style={styles.label}>تواصل مع الدعم الفني</Text>
        <TouchableOpacity onPress={handleContactEmail}>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#0077b6" />
        </TouchableOpacity>
      </View>

      {/* مشاركة التطبيق */}
      <View style={styles.row}>
        <Feather name="share-2" size={24} color="#0077b6" />
        <Text style={styles.label}>مشاركة التطبيق</Text>
        <TouchableOpacity onPress={handleShare}>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#0077b6" />
        </TouchableOpacity>
      </View>

      {/* حول التطبيق */}
      <View style={styles.row}>
        <Ionicons name="information-circle-outline" size={24} color="#0077b6" />
        <Text style={styles.label}>حول التطبيق</Text>
        <TouchableOpacity onPress={() => router.push('/pages/About/Aboutapp')}>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#0077b6" />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Ionicons name="help-circle-outline" size={24} color="#0077b6"/>
        <Text style={styles.label}>حول المطور</Text>
        <TouchableOpacity onPress={() => router.push('/pages/About/About')}>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#0077b6" />
        </TouchableOpacity>
      </View>
      {/* حذف الحساب */}
      <View style={[styles.row, { borderBottomWidth: 0 }]}>
        <MaterialCommunityIcons name="delete-outline" size={24} color="#e63946" />
        <Text style={[styles.label, { color: '#e63946' }]}>حذف الحساب</Text>
        <TouchableOpacity onPress={handleDeleteAccount}>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#e63946" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
  style={styles.backButton}
  onPress={() => router.back()}
>
  <Ionicons name="arrow-back" size={24} color="#fff" />
  <Text style={styles.backButtonText}>رجوع</Text>
</TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 16,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    gap: 10,
  },
  label: { fontSize: 17, color: '#333', flex: 1, marginHorizontal: 10, fontWeight: 'bold' },
  langButton: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  langButtonActive: {
    backgroundColor: '#0077b6',
  },
  langText: { color: '#333', fontWeight: 'bold' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0077b6',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 30,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 25,
    gap: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0077b6',
    marginLeft: 10,
  },
});