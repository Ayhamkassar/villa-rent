import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedScreen from '../../../components/AnimatedScreen';

export default function About() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL('mailto:kassaeraeham067@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+963981834818');
  };

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/Ayhamkassar');
  };

  return (
    <AnimatedScreen animationType="slideInRight" duration={400}>
      <LinearGradient colors={['#667eea', '#764ba2', '#f093fb']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="information" size={40} color="#fff" />
            <Text style={styles.title}>حول التطبيق</Text>
          </View>
        </View>

        {/* Developer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-circle" size={30} color="#667eea" />
            <Text style={styles.cardTitle}>المطور</Text>
          </View>
          <Text style={styles.developerName}>محمد أيهم قصار</Text>
          <Text style={styles.developerRole}>مبرمج ومطور تطبيقات ومواقع ويب</Text>
        </View>

        {/* Skills Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="code-tags" size={30} color="#667eea" />
            <Text style={styles.cardTitle}>المهارات التقنية</Text>
          </View>
          <View style={styles.skillsContainer}>
            {[
              'React Native', 'Node.js', '.NET Framework MVC', 'C#', 
              'MongoDB', 'SQL Server', 'ICDL'
            ].map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.additionalSkills}>
            كتابة سريعة، حل المشكلات، العمل تحت الضغط، التفكير المنطقي
          </Text>
        </View>

        {/* Education Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="school" size={30} color="#667eea" />
            <Text style={styles.cardTitle}>التعليم</Text>
          </View>
          <View style={styles.educationItem}>
            <FontAwesome name="university" size={20} color="#764ba2" />
            <View style={styles.educationText}>
              <Text style={styles.educationTitle}>جامعة دمشق - الهمك</Text>
              <Text style={styles.educationPeriod}>2023 - 2025</Text>
            </View>
          </View>
          <View style={styles.educationItem}>
            <MaterialCommunityIcons name="laptop" size={20} color="#764ba2" />
            <View style={styles.educationText}>
              <Text style={styles.educationTitle}>الجامعة الافتراضية السورية - ITE</Text>
              <Text style={styles.educationPeriod}>2023 - الآن</Text>
            </View>
          </View>
          <View style={styles.educationItem}>
            <MaterialCommunityIcons name="certificate" size={20} color="#764ba2" />
            <View style={styles.educationText}>
              <Text style={styles.educationTitle}>المعهد التقاني للحاسوب (TCC)</Text>
              <Text style={styles.educationPeriod}>خريج 2025</Text>
            </View>
          </View>
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="contacts" size={30} color="#667eea" />
            <Text style={styles.cardTitle}>معلومات التواصل</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="email" size={24} color="#f093fb" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>البريد الإلكتروني</Text>
              <Text style={styles.contactValue}>kassaeraeham067@gmail.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={handlePhonePress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="phone" size={24} color="#f093fb" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>الهاتف</Text>
              <Text style={styles.contactValue}>0981834818</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactItem, { borderBottomWidth: 0 }]} 
            onPress={handleGitHubPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="github" size={24} color="#f093fb" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>GitHub</Text>
              <Text style={styles.contactValue}>github.com/Ayhamkassar</Text>
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
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
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
  developerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 5,
  },
  developerRole: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillTag: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  additionalSkills: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  educationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  educationText: {
    marginLeft: 15,
    flex: 1,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  educationPeriod: {
    fontSize: 14,
    color: '#666',
  },
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
  contactText: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
    opacity: 0.8,
  },
});
