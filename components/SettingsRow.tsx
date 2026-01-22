import { ChevronLeft } from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingsRowProps {
  icon: ReactNode;
  label: string;
  rightContent?: ReactNode;
  showChevron?: boolean;
  onClick?: (event?: GestureResponderEvent) => void;
  variant?: 'default' | 'danger';
  noPadding?: boolean;
  onPress?: () => void;
}

export function SettingsRow({
  icon,
  label,
  rightContent,
  showChevron = false,
  onClick,
  variant = 'default',
  noPadding = false,
}: SettingsRowProps) {
  const textColor = variant === 'danger' ? '#e63946' : '#333';
  const chevronColor = variant === 'danger' ? '#e63946' : '#999';

  const Container: any = onClick ? TouchableOpacity : View;

  return (
    <Container
      onPress={onClick}
      activeOpacity={0.7}
      style={[
        styles.row,
        noPadding ? {} : styles.padded,
        onClick ? styles.clickable : null,
      ]}
    >
      <View style={styles.rowContent}>
        <View style={styles.leftContent}>
          {icon}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </View>

        <View style={styles.rightContent}>
          {rightContent}
          {showChevron && <ChevronLeft width={20} height={20} color={chevronColor} />}
        </View>
      </View>

      {/* Show right content below if noPadding */}
      {noPadding && rightContent && (
        <View style={styles.noPaddingContent}>
          {rightContent}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 6,
  },
  padded: {
    padding: 16,
  },
  clickable: {
    // Optional visual feedback on press (scale) handled by TouchableOpacity's activeOpacity
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
  noPaddingContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
  },
});
