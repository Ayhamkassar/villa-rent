import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface FormTextareaProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textarea}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline
        textAlignVertical="top" // مهم ليصير النص يبدأ من فوق
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  textarea: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    minHeight: 120, // ارتفاع افتراضي مشابه 6 صفوف
    textAlign: 'right',
  },
});
