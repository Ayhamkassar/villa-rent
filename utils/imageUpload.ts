// utils/imageUpload.ts
import * as ImagePicker from "expo-image-picker";

export const pickImages = async (currentCount: number = 0, maxImages: number = 5): Promise<string[]> => {
  const remaining = maxImages - currentCount;

  if (remaining <= 0) {
    alert(`يمكنك اختيار ${maxImages} صور فقط.`);
    return [];
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
  });

  if (result.canceled) return [];

  const pickedUris = result.assets.map(img => img.uri).slice(0, remaining);

  if (pickedUris.length < result.assets.length) {
    alert(`تم اختيار الحد الأقصى من الصور (${maxImages}).`);
  }

  return pickedUris;
};
