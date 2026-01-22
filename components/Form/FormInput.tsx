import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'time';
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  icon
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && '*'}
      </Text>
      <View style={styles.inputWrapper}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          keyboardType={type === 'number' ? 'numeric' : 'default'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#2E7D32' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10 },
  icon: { marginRight: 6 },
  input: { flex: 1, height: 40 }
});
