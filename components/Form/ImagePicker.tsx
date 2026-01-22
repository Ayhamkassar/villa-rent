import * as ImagePickerExpo from 'expo-image-picker';
import React from 'react';
import { Button, View } from 'react-native';

interface ImagePickerProps {
  onImagesSelected: (images: string[]) => void;
  imageCount: number;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ onImagesSelected, imageCount }) => {
  const pickImages = async () => {
    const result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      onImagesSelected(uris);
    }
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <Button title={`اختر الصور (${imageCount})`} onPress={pickImages} />
    </View>
  );
};
