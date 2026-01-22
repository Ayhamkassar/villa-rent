import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface VillaInfoCardProps {
  title: string;
  children: React.ReactNode;
}

export const VillaInfoCard: React.FC<VillaInfoCardProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // خط تحت العنوان مشابه للويب
    paddingBottom: 4,
  },
});
