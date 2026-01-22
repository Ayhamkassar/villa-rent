import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({ label, value, onChange, options, required }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label} {required && '*'}</Text>
    <View style={styles.pickerWrapper}>
      <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
        {options.map(opt => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#2E7D32' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10 },
  picker: { height: 40 }
});
