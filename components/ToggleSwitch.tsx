import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  const translateX = useRef(new Animated.Value(enabled ? 24 : 2)).current;

  // Animate when enabled changes
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: enabled ? 24 : 2,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [enabled]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onChange(!enabled)}
      style={[
        styles.switch,
        { backgroundColor: enabled ? '#0077b6' : '#ccc' },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 56, // approx 14 * 4 in px scale
    height: 28, // approx 7 * 4
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2, // for Android shadow
  },
});
