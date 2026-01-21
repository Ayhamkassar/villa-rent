/**
 * Button Component
 * Reusable button with multiple variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../constants/theme';

/**
 * @param {object} props
 * @param {string} props.title - Button text
 * @param {function} props.onPress - Press handler
 * @param {string} props.variant - Button variant (primary, secondary, danger, outline)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.loading - Show loading indicator
 * @param {boolean} props.disabled - Disable button
 * @param {object} props.icon - Icon component to show
 * @param {object} props.style - Additional styles
 * @param {object} props.textStyle - Additional text styles
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: { backgroundColor: COLORS.secondary },
          text: { color: COLORS.white },
        };
      case 'danger':
        return {
          button: { backgroundColor: COLORS.error },
          text: { color: COLORS.white },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: COLORS.primary,
          },
          text: { color: COLORS.primary },
        };
      case 'ghost':
        return {
          button: { backgroundColor: 'transparent' },
          text: { color: COLORS.primary },
        };
      default: // primary
        return {
          button: { backgroundColor: COLORS.secondary },
          text: { color: COLORS.white },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          button: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
          text: { fontSize: FONT_SIZES.sm },
        };
      case 'lg':
        return {
          button: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl },
          text: { fontSize: FONT_SIZES.xl },
        };
      default: // md
        return {
          button: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
          text: { fontSize: FONT_SIZES.lg },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles.button,
        sizeStyles.button,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.text.color} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  text: {
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
