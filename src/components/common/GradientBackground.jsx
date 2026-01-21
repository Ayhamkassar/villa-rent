/**
 * GradientBackground Component
 * Wrapper with gradient background
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - Content
 * @param {string} props.variant - Gradient variant (primary, login, register, details)
 * @param {string[]} props.colors - Custom gradient colors
 * @param {object} props.style - Additional styles
 */
const GradientBackground = ({
  children,
  variant = 'primary',
  colors,
  style,
}) => {
  const getGradientColors = () => {
    if (colors) return colors;
    
    switch (variant) {
      case 'login':
        return COLORS.gradients.login;
      case 'register':
        return COLORS.gradients.register;
      case 'details':
        return COLORS.gradients.details;
      default:
        return COLORS.gradients.primary;
    }
  };

  return (
    <LinearGradient colors={getGradientColors()} style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
