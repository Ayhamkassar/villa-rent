import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ImagePickerButton({ images, setImages }: any) {
  const pickImages = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("نحتاج صلاحية الوصول إلى الصور!");
        return;
      }
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.uri.split("/").pop(),
          type: `image/${asset.uri.split(".").pop() === "jpg" ? "jpeg" : asset.uri.split(".").pop()}`,
        }));
        setImages((prev: any) => [...prev, ...selectedImages]);
      }
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الصور.");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={pickImages}>
      <Text style={styles.text}>
        {images.length > 0 ? `تم اختيار ${images.length} صورة` : "اختر صور المزرعة"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: "#0f766e", borderRadius: 10, paddingVertical: 15, marginBottom: 20, alignItems: "center" },
  text: { color: "white", fontWeight: "bold", fontSize: 16 },
});
