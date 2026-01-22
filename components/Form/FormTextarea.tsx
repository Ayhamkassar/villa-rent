import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface FormTextareaProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ value, onChange, placeholder }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.textarea}
      multiline
      numberOfLines={4}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    minHeight: 80
  }
});
