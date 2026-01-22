import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  label: string;
  value?: string;

  editing?: boolean;
  readOnly?: boolean;

  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onChange?: (text: string) => void;

  danger?: boolean;
  onPress?: () => void;
}

export const ProfileField = ({
  label,
  value,
  editing = false,
  readOnly = false,
  onEdit,
  onSave,
  onCancel,
  onChange,
  danger = false,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={danger || onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={{
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: danger ? 1 : 0,
        borderColor: danger ? '#FF4D4F' : 'transparent',
      }}
    >
      <Text style={{ color: '#666', marginBottom: 6 }}>{label}</Text>

      {editing && !readOnly ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TextInput
            value={value}
            onChangeText={onChange}
            style={{
              flex: 1,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              borderColor: '#ddd',
            }}
          />

          <TouchableOpacity onPress={onSave}>
            <Ionicons name="checkmark" size={22} color="green" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={22} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: danger ? '#FF4D4F' : '#000' }}>
            {value || '—'}
          </Text>

          {!readOnly && !danger && onEdit && (
            <TouchableOpacity onPress={onEdit}>
              <Ionicons name="pencil" size={18} color="#1E90FF" />
            </TouchableOpacity>
          )}

          {danger && (
            <Ionicons name="log-out-outline" size={20} color="#FF4D4F" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};
