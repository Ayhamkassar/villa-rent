import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedScreen from '../../../components/AnimatedScreen';

export default function AboutApp() {
  return (
    <AnimatedScreen animationType="slideInRight" duration={400}>
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons name="information" size={40} color="#fff" />
              <Text style={styles.title}>حول التطبيق</Text>
            </View>
          </View>

          {/* App Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="apps" size={30} color="#667eea" />
              <Text style={styles.cardTitle}>معلومات التطبيق</Text>
            </View>
            <Text style={styles.appName}>مزرعتي</Text>
            <Text style={styles.version}>الإصدار 1.0.0</Text>
            <Text style={styles.text}>
              تطبيق مزرعتي هو منصة سهلة وسريعة لحجز المزارع والفلل في سوريا. يمكنك استعراض المزارع، معرفة تفاصيلها، الحجز مباشرة، والتواصل مع المالك بسهولة.
            </Text>
          </View>

          {/* Contact Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="contacts" size={30} color="#667eea" />
              <Text style={styles.cardTitle}>للتواصل والدعم</Text>
            </View>
            <TouchableOpacity style={[styles.contactItem, { borderBottomWidth: 0 }]} onPress={() => Linking.openURL('mailto:myvilla234@email.com')} activeOpacity={0.7}>
              <MaterialCommunityIcons name="email-outline" size={24} color="#0077b6" />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>البريد الإلكتروني</Text>
                <Text style={styles.contactValue}>myvilla234@email.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <MaterialCommunityIcons name="copyright" size={16} color="#fff" />
            <Text style={styles.footerText}>2025 جميع الحقوق محفوظة</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  header: { marginBottom: 30 },
  titleContainer: { alignItems: 'center', marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  featureText: { fontSize: 16, color: '#333', marginLeft: 10 },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: -5,
    paddingHorizontal: 5,
  },
  contactText: { marginLeft: 15, flex: 1 },
  contactLabel: { fontSize: 14, color: '#666', marginBottom: 2 },
  contactValue: { fontSize: 16, fontWeight: '600', color: '#333' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 15,
  },
  footerText: { fontSize: 14, color: '#fff', marginLeft: 5, opacity: 0.8 },
});