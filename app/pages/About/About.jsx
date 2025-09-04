import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function About() {
    const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#1E90FF" />
      </TouchableOpacity>
      <Text style={styles.title}>حول التطبيق</Text>
      <Text style={styles.sectionTitle}>المطور:</Text>
      <Text style={styles.text}>محمد أيهم قصار</Text>

      <Text style={styles.sectionTitle}>المهنة:</Text>
      <Text style={styles.text}>مبرمج ومطور تطبيقات ومواقع ويب</Text>

      <Text style={styles.sectionTitle}>المهارات:</Text>
      <Text style={styles.text}>
        - React Native {"\n"}
        - Node.js {"\n"}
        - .NET Framework MVC {"\n"}
        - C# {"\n"}
        - قواعد بيانات (MongoDB, SQL Server) {"\n"}
        - ICDL {"\n"}
        - كتابة سريعة، حل المشكلات، العمل تحت الضغط، التفكير المنطقي
      </Text>

      <Text style={styles.sectionTitle}>التعليم:</Text>
      <Text style={styles.text}>
        - جامعة دمشق، الهمك (2023 - 2025) {"\n"}
        - الجامعة الافتراضية السورية، اختصاص ITE (2023 - الآن) {"\n"}
        - خريج المعهد التقاني للحاسوب (TCC) (2025)
      </Text>

      <Text style={styles.sectionTitle}>معلومات التواصل:</Text>
      <Text style={styles.text}>
        📧 البريد الإلكتروني: kassaeraeham067@gmail.com {"\n"}
        📱 الهاتف: 0981834818 {"\n"}
        🌍 GitHub: https://github.com/Ayhamkassar
      </Text>

      <Text style={styles.footer}>© 2025 جميع الحقوق محفوظة</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E90FF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  footer: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
  },
});
