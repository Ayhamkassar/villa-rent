import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import BackButton from "../../../components/BackButton";
import { FormInput } from "../../../components/FormInput";
import { FormTextarea } from "../../../components/FormTextarea";
import ImagePickerButton from "../../../components/ImagePickerButton";
import SubmitButton from "../../../components/SubmitButton";
import { VillaFormData } from "../../../types/types";
import { fetchVilla, updateVilla } from "../../../utils/api";
import { formDataToMultipart } from "../../../utils/helpers";

export default function EditVillaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VillaFormData>({
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
    if (id) prefillVilla();
  }, [id]);

  const handleChange = <K extends keyof VillaFormData>(name: K, value: VillaFormData[K]) =>
    setFormData({ ...formData, [name]: value });

  const prefillVilla = async () => {
    try {
      const { data } = await fetchVilla(id);
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
    } catch {
      Alert.alert("خطأ", "تعذر تحميل بيانات المزرعة");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = formDataToMultipart(formData);
      await updateVilla(id, data);
      Alert.alert("نجاح", "تم تحديث المزرعة بنجاح");
      router.back();
    } catch (error: any) {
      Alert.alert("خطأ", error.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => router.back()} />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#065f46", alignSelf: "center" }}>
          تعديل مزرعتي 🌴
        </Text>

        <FormInput label="" placeholder="اسم المزرعة *" value={formData.title} onChangeText={(text: any) => handleChange("title", text)} />
        <FormInput label="" placeholder="العنوان" value={formData.address} onChangeText={(text: any) => handleChange("address", text)} />
        <FormInput label="" placeholder="رقم التواصل(واتساب)" value={formData.contactNumber} onChangeText={(text: any) => handleChange("contactNumber", text)} keyboardType="phone-pad" />

        {formData.type === "sale" ? (
          <>
            <FormInput label="" placeholder="المساحة (هكتار)" value={formData.sizeInHectares} onChangeText={(text: any) => handleChange("sizeInHectares", text)} keyboardType="numeric" />
            <FormInput label="" placeholder="السعر *" value={formData.price} onChangeText={(text: any) => handleChange("price", text)} keyboardType="numeric" />
          </>
        ) : (
          <>
            <FormInput label="" placeholder="سعر منتصف الأسبوع" value={formData.midweekPrice} onChangeText={(text: any) => handleChange("midweekPrice", text)} keyboardType="numeric" />
            <FormInput label="" placeholder="سعر نهاية الأسبوع" value={formData.weekendPrice} onChangeText={(text: any) => handleChange("weekendPrice", text)} keyboardType="numeric" />
          </>
        )}

        <FormInput label="" placeholder="عدد الضيوف" value={formData.guests} onChangeText={(text: any) => handleChange("guests", text)} keyboardType="numeric" />
        <FormInput label="" placeholder="عدد غرف النوم" value={formData.bedrooms} onChangeText={(text: any) => handleChange("bedrooms", text)} keyboardType="numeric" />
        <FormInput label="" placeholder="عدد الحمامات" value={formData.bathrooms} onChangeText={(text: any) => handleChange("bathrooms", text)} keyboardType="numeric" />
        <FormTextarea placeholder="الوصف" value={formData.description} onChangeText={(text: any) => handleChange("description", text)} />
        <ImagePickerButton images={formData.images} setImages={(imgs: any) => handleChange("images", imgs)} />
        <SubmitButton loading={loading} onPress={handleSubmit} title="حفظ التغييرات" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
