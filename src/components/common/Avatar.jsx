/**
 * Avatar Component
 * User profile image with fallback
 */

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS } from '../../constants/theme';
import { getProfileImageUrl } from '../../utils/imageHelpers';

/**
 * @param {object} props
 * @param {string} props.imageUrl - Profile image URL or path
 * @param {number} props.size - Avatar size
 * @param {function} props.onPress - Press handler
 * @param {object} props.style - Additional styles
 */
const Avatar = ({ imageUrl, size = 100, onPress, style }) => {
  const fullUrl = getProfileImageUrl(imageUrl);
  
  const avatarStyles = [
    styles.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    style,
  ];

  const content = fullUrl ? (
    <Image source={{ uri: fullUrl }} style={avatarStyles} />
  ) : (
    <View style={[avatarStyles, styles.placeholder]}>
      <Ionicons name="person-circle-outline" size={size} color={COLORS.accent} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
  },
});

export default Avatar;
