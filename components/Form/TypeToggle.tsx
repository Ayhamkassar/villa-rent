import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FarmType } from '../../types';

interface TypeToggleProps {
  selected: FarmType;
  onChange: (type: FarmType) => void;
}

export const TypeToggle: React.FC<TypeToggleProps> = ({ selected, onChange }) => (
  <View style={styles.container}>
    {(['rent', 'sale'] as FarmType[]).map(type => (
      <TouchableOpacity
        key={type}
        style={[styles.button, selected === type && styles.selected]}
        onPress={() => onChange(type)}
      >
        <Text style={[styles.text, selected === type && styles.textSelected]}>
          {type === 'rent' ? 'إيجار' : 'بيع'}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 10 },
  button: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#2E7D32', borderRadius: 10, alignItems: 'center' },
  selected: { backgroundColor: '#2E7D32' },
  text: { color: '#2E7D32', fontWeight: 'bold' },
  textSelected: { color: 'white' }
});
