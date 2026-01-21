/**
 * Card Component
 * Reusable card container with shadow and styling
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '../../constants/theme';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {function} props.onPress - Press handler (makes card touchable)
 * @param {object} props.style - Additional styles
 * @param {boolean} props.transparent - Use transparent background
 */
const Card = ({ children, onPress, style, transparent = false }) => {
  const cardStyles = [
    styles.card,
    transparent && styles.transparent,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  transparent: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
});

export default Card;
