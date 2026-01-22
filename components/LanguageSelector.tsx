import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LanguageSelectorProps {
  selected: 'ar' | 'en';
  onChange: (language: 'ar' | 'en') => void;
}

export function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selected === 'ar' ? styles.buttonActive : styles.buttonInactive,
        ]}
        onPress={() => onChange('ar')}
      >
        <Text style={[styles.text, selected === 'ar' && styles.textActive]}>
          العربية
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          selected === 'en' ? styles.buttonActive : styles.buttonInactive,
        ]}
        onPress={() => onChange('en')}
      >
        <Text style={[styles.text, selected === 'en' && styles.textActive]}>
          English
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12, // requires RN 0.70+ or replace with marginHorizontal
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // shadow for Android
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  buttonActive: {
    backgroundColor: '#0077b6',
    transform: [{ scale: 1.05 }],
  },
  buttonInactive: {
    backgroundColor: '#eee',
  },
  text: {
    fontWeight: '600',
    color: '#666',
    fontSize: 16,
  },
  textActive: {
    color: '#fff',
  },
});
