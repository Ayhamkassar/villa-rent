/**
 * FarmCard Component
 * Card for displaying farm/villa in list
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../../constants/theme';
import { getFarmImageUrl } from '../../utils/imageHelpers';
import { formatFarmPrice, getFarmTypeText } from '../../utils/formatting';

/**
 * @param {object} props
 * @param {object} props.farm - Farm data
 * @param {function} props.onPress - Press handler
 * @param {function} props.onEditPress - Edit button press handler
 * @param {boolean} props.showEditButton - Show edit button
 */
const FarmCard = ({ farm, onPress, onEditPress, showEditButton = false }) => {
  const imageUrl = getFarmImageUrl(farm.images?.[0]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {farm.name}
        </Text>
        
        <Text style={styles.price}>
          {formatFarmPrice(farm)}
        </Text>
        
        <Text style={styles.type}>
          {getFarmTypeText(farm.type)}
        </Text>
      </View>

      {showEditButton && onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editText}>تعديل</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.md,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  price: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.secondary,
    marginVertical: SPACING.xs,
  },
  type: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  editButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  editText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default FarmCard;
