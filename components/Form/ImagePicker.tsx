import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export interface ImagePickerProps {
  imageCount: number;
  onPickImages: () => void; // بدل onPress
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ imageCount, onPickImages }) => {
  return (
    <TouchableOpacity
      onPress={onPickImages}
      style={{
        padding: 16,
        backgroundColor: "#E0E0E0",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
      }}
    >
      <Text>اختر الصور ({imageCount}/5)</Text>
    </TouchableOpacity>
  );
};
