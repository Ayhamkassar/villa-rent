/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';

/**
 * @param {object} props
 * @param {string} props.size - Spinner size (small, large)
 * @param {string} props.color - Spinner color
 * @param {string} props.text - Loading text
 * @param {boolean} props.fullScreen - Center on full screen
 * @param {object} props.style - Additional styles
 */
const LoadingSpinner = ({
  size = 'large',
  color = COLORS.primary,
  text,
  fullScreen = false,
  style,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  text: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
});

export default LoadingSpinner;
