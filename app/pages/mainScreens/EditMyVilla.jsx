import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert, Platform, KeyboardAvoidingView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL } from "@/server/config";

export default function EditMyVilla() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    sizeInHectares: "",
    price: "",
    type: "sale",
    status: "available",
    images: [],
    guests: "",
    bedrooms: "",
    bathrooms: "",
    midweekPrice: "",
    weekendPrice: "",
    contactNumber: "",
  });

  useEffect(() => {
    (async () => {
      if (id) await prefillAndGuard();
    })();
  }, [id]);

  const handleChange = (name, value) => setFormData({ ...formData, [name]: value });

  const pickImages = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("نحتاج صلاحية الوصول إلى الصور!");
        return;
      }
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 1 });
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => ({ uri: asset.uri, name: asset.uri.split("/").pop(), type: `image/${asset.uri.split(".").pop() === "jpg" ? "jpeg" : asset.uri.split(".").pop()}` }));
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...selectedImages] }));
      }
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الصور.");
    }
  };

  const prefillAndGuard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (!token || !userId) {
        Alert.alert("تنبيه", "يرجى تسجيل الدخول");
        router.replace("/pages/Login/Login");
        return;
      }
      const { data } = await axios.get(`${API_URL}/api/farms/${id}`);
      const ownerId = data.ownerId?._id || data.ownerId;
      if (String(ownerId) !== String(userId)) {
        Alert.alert("غير مصرح", "يمكن فقط للمالك تعديل هذه المزرعة");
        router.back();
        return;
      }
      setFormData({
        title: data.name || "",
        description: data.description || "",
        address: data.address?.fullAddress || data.address || "",
        sizeInHectares: data.sizeInHectares?.toString?.() || "",
        price: data.price?.toString?.() || "",
        type: data.type || "sale",
        status: data.status || "available",
        images: [],
        guests: data.guests?.toString?.() || "",
        bedrooms: data.bedrooms?.toString?.() || "",
        bathrooms: data.bathrooms?.toString?.() || "",
        midweekPrice: data.midweekPrice?.toString?.() || "",
        weekendPrice: data.weekendPrice?.toString?.() || "",
        contactNumber: data.contactNumber || "",
      });
    } catch (err) {
      Alert.alert("خطأ", "تعذر تحميل بيانات المزرعة");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("تنبيه", "يرجى تسجيل الدخول");
        return;
      }
      const data = new FormData();
      data.append("name", formData.title);
      data.append("description", formData.description);
      data.append("address", JSON.stringify(formData.address || ""));
      data.append("price", formData.price || 0);
      data.append("type", formData.type);
      data.append("status", formData.status);
      data.append("guests", formData.guests || 0);
      data.append("bedrooms", formData.bedrooms || 0);
      data.append("bathrooms", formData.bathrooms || 0);
      data.append("midweekPrice", formData.midweekPrice || 0);
      data.append("weekendPrice", formData.weekendPrice || 0);
      data.append("contactNumber", formData.contactNumber || "");
      if (formData.type === "sale") data.append("sizeInHectares", formData.sizeInHectares || 0);
      formData.images.forEach((image, index) => {
        data.append("images", { uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""), name: image.name || `image${index}.jpeg`, type: image.type || "image/jpeg" });
      });
      setLoading(true);
      await axios.put(`${API_URL}/api/farms/${id}`, data, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } });
      Alert.alert("نجاح", "تم تحديث المزرعة بنجاح");
      router.back();
    } catch (error) {
      Alert.alert("خطأ", error.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>تعديل مزرعتي 🌴</Text>

        {/* No owner picker here */}

        <TextInput style={styles.input} placeholder="اسم المزرعة *" value={formData.title} onChangeText={(text) => handleChange("title", text)} />
        <TextInput style={styles.input} placeholder="العنوان" value={formData.address} onChangeText={(text) => handleChange("address", text)} />
        <TextInput style={styles.input} placeholder="رقم التواصل(واتساب)" keyboardType="phone-pad" value={formData.contactNumber} onChangeText={(text) => handleChange("contactNumber", text)} />

        {formData.type === "sale" ? (
          <>
            <TextInput style={styles.input} placeholder="المساحة (هكتار)" keyboardType="numeric" value={formData.sizeInHectares} onChangeText={(text) => handleChange("sizeInHectares", text)} />
            <TextInput style={styles.input} placeholder="السعر *" keyboardType="numeric" value={formData.price} onChangeText={(text) => handleChange("price", text)} />
            <TextInput style={styles.input} placeholder="عدد الضيوف" keyboardType="numeric" value={formData.guests} onChangeText={(text) => handleChange("guests", text)} />
            <TextInput style={styles.input} placeholder="عدد غرف النوم" keyboardType="numeric" value={formData.bedrooms} onChangeText={(text) => handleChange("bedrooms", text)} />
            <TextInput style={styles.input} placeholder="عدد الحمامات" keyboardType="numeric" value={formData.bathrooms} onChangeText={(text) => handleChange("bathrooms", text)} />
          </>
        ) : (
          <>
            <TextInput style={styles.input} placeholder="عدد الضيوف" keyboardType="numeric" value={formData.guests} onChangeText={(text) => handleChange("guests", text)} />
            <TextInput style={styles.input} placeholder="عدد غرف النوم" keyboardType="numeric" value={formData.bedrooms} onChangeText={(text) => handleChange("bedrooms", text)} />
            <TextInput style={styles.input} placeholder="عدد الحمامات" keyboardType="numeric" value={formData.bathrooms} onChangeText={(text) => handleChange("bathrooms", text)} />
            <TextInput style={styles.input} placeholder="سعر منتصف الأسبوع" keyboardType="numeric" value={formData.midweekPrice} onChangeText={(text) => handleChange("midweekPrice", text)} />
            <TextInput style={styles.input} placeholder="سعر نهاية الأسبوع" keyboardType="numeric" value={formData.weekendPrice} onChangeText={(text) => handleChange("weekendPrice", text)} />
          </>
        )}

        <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="الوصف" value={formData.description} onChangeText={(text) => handleChange("description", text)} />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
          <Text style={styles.imagePickerText}>{formData.images.length > 0 ? `تم اختيار ${formData.images.length} صورة` : "اختر صور المزرعة"}</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#2ecc71" />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>حفظ التغييرات</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#a7d8f7", flex: 1 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#065f46", alignSelf: "center" },
  input: { backgroundColor: "white", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginBottom: 15, fontSize: 16, borderColor: "#0f766e", borderWidth: 1, textAlign: "right" },
  imagePicker: { backgroundColor: "#0f766e", borderRadius: 10, paddingVertical: 15, marginBottom: 20, alignItems: "center" },
  imagePickerText: { color: "white", fontWeight: "bold", fontSize: 16 },
  submitButton: { backgroundColor: "#065f46", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginBottom: 40 },
  submitButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#0077b6', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginBottom: 10 },
  backText: { color: '#fff', fontWeight: 'bold' },
});


