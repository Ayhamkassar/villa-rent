import React from 'react';
import { Text, View } from 'react-native';

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    {icon}
    <Text style={{ fontSize: 16, color: '#0077b6' }}>{label}: {value}</Text>
  </View>
);
