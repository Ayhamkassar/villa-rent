// pages/Admin/villas/AddVilla.tsx
import React, { useState, useEffect } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import BackButton from "../../../../components/BackButton";
import { FormInput } from "../../../../components/FormInput";
import { FormTextarea } from "../../../../components/FormTextarea";
import ImagePickerButton from "../../../../components/ImagePickerButton";
import SubmitButton from "../../../../components/SubmitButton";
import { TypeToggle } from "../../../../components/Form/TypeToggle";
import { pickImages } from "../../../../utils/imageUpload";
import { FarmFormData, FarmType } from "../../../../types";
import { FormSelect } from "@/components/Form/FormSelect";

export default function AddVilla() {
  type ImageItem = { uri: string; name?: string; type?: string };

  const [farmType, setFarmType] = useState<FarmType>("rent");
  const [owners, setOwners] = useState<{ id: string; name: string }[]>([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: "success" | "error" | "info" }>({ visible: false, message: "", type: "info" });

  const [form, setForm] = useState<Partial<FarmFormData>>({
    name: "",
    address: "",
    contact: "",
    size: "",
    salePrice: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
    midweekPrice: "",
    weekendPrice: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  // Toast helper
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  // Fetch users for owner select
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingOwners(true);
        const token = await AsyncStorage.getItem("token");
        if (!token) return showToast("الرجاء تسجيل الدخول", "error");

        const { data } = await axios.get("https://api-villa-rent.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOwners(data.map((u: any) => ({ id: u._id, name: u.name })));
      } catch (err) {
        console.log(err);
        showToast("فشل جلب المستخدمين", "error");
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchUsers();
  }, []);

  // Pick images (max 5)
  const handlePickImages = async () => {
    if (selectedImages.length >= 5) {
      showToast("يمكنك اختيار 5 صور كحد أقصى", "error");
      return;
    }
  
    const uris = await pickImages(selectedImages.length, 5); // uris: string[]
    const newImages = uris.map(uri => ({ uri })); // حول كل string لـ object
    setSelectedImages(prev => [...prev, ...newImages]);
  };
  

  const handleRemoveImage = (index: number) => setSelectedImages(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!selectedOwner) return showToast("اختر صاحب المزرعة", "error");
    if (!form.name?.trim()) return showToast("ادخل اسم المزرعة", "error");
    if (selectedImages.length === 0) return showToast("اختر على الأقل صورة واحدة", "error");
    if (selectedImages.length > 5) return showToast("يمكنك اختيار 5 صور كحد أقصى", "error");
    if (!form.contact?.trim() || !/^\d{8,15}$/.test(form.contact)) {
      return showToast("الرجاء إدخال رقم اتصال صحيح", "error");
    }
    
    try {
      setIsSubmitting(true);
  
      const token = await AsyncStorage.getItem("token");
      const formDataPayload = new FormData();
  
      formDataPayload.append("name", form.name || "");
      formDataPayload.append("address", form.address || "");
      formDataPayload.append("contact", form.contact || "");
      formDataPayload.append("guests", form.guests || "");
      formDataPayload.append("bedrooms", form.bedrooms || "");
      formDataPayload.append("bathrooms", form.bathrooms || "");
      formDataPayload.append("description", form.description || "");
      formDataPayload.append("type", farmType);
      formDataPayload.append("ownerId", selectedOwner);
  
      if (farmType === "sale") {
        formDataPayload.append("size", form.size || "");
        formDataPayload.append("salePrice", form.salePrice || "");
      } else {
        formDataPayload.append("midweekPrice", form.midweekPrice || "");
        formDataPayload.append("weekendPrice", form.weekendPrice || "");
        formDataPayload.append("startTime", form.startTime || "");
        formDataPayload.append("endTime", form.endTime || "");
      }
      selectedImages.forEach((img, index) => {
        // كل img هنا هو object { uri, name?, type? }
        const uri = img.uri;
      
        // نحاول استخراج امتداد الملف من uri
        const uriParts = uri.split(".");
        const fileExt = uriParts[uriParts.length - 1] || "jpg"; // افتراضي jpg لو مافي امتداد
      
        const name = img.name || `image_${index}.${fileExt}`;
        const type = img.type || `image/${fileExt}`;
      
        formDataPayload.append("images", {
          uri,
          name,
          type,
        } as any); // as any مقبول في React Native
      });
      
      
  
      await axios.post(
        "https://api-villa-rent.onrender.com/api/farms",
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      showToast("تمت إضافة المزرعة بنجاح", "success");
      setForm({} as Partial<FarmFormData>);
      setSelectedOwner("");
      setSelectedImages([]);
      setFarmType("rent");
  
    } catch (err: any) {
      console.log(form)
      console.log(err.response?.data || err);
      showToast("فشل إضافة المزرعة", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <BackButton onPress={() => {}} />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#065f46", alignSelf: "center" }}>
          إضافة مزرعة جديدة 🌴
        </Text>

        {/* Owner select */}
        <Text style={{ fontWeight: "bold", color: "#065f46", marginBottom: 8 }}>اختر صاحب المزرعة</Text>
        {loadingOwners ? (
          <Text>جاري التحميل...</Text>
        ) : (
          <FormSelect
            label=""
            required
            value={selectedOwner}
            onChange={setSelectedOwner}
            options={[{ value: "", label: "اختر المالك..." }, ...owners.map(o => ({ value: o.id, label: o.name }))]}
          />
        )}

        {/* Type Toggle */}
        <TypeToggle selected={farmType} onChange={setFarmType} />

        {/* Basic Inputs */}
        <FormInput label="" placeholder="اسم المزرعة *" value={form.name || ""} onChangeText={text => setForm({ ...form, name: text })} />
        <FormInput label="" placeholder="العنوان" value={form.address || ""} onChangeText={text => setForm({ ...form, address: text })} />
        <FormInput label="" placeholder="رقم التواصل" value={form.contact || ""} onChangeText={text => setForm({ ...form, contact: text })} />
        {/* Sale or Rent Fields */}
        {farmType === "sale" ? (
          <>
            <FormInput label="" placeholder="المساحة (هكتار)" value={form.size || ""} onChangeText={text => setForm({ ...form, size: text })} keyboardType="numeric" />
            <FormInput label="" placeholder="السعر" value={form.salePrice || ""} onChangeText={text => setForm({ ...form, salePrice: text })} keyboardType="numeric" />
          </>
        ) : (
          <>
            <FormInput label="" placeholder="سعر منتصف الأسبوع" value={form.midweekPrice || ""} onChangeText={text => setForm({ ...form, midweekPrice: text })} keyboardType="numeric" />
            <FormInput label="" placeholder="سعر نهاية الأسبوع" value={form.weekendPrice || ""} onChangeText={text => setForm({ ...form, weekendPrice: text })} keyboardType="numeric" />
          </>
        )}

        <FormInput label="" placeholder="عدد الضيوف" value={form.guests || ""} onChangeText={text => setForm({ ...form, guests: text })} keyboardType="numeric" />
        <FormInput label="" placeholder="عدد غرف النوم" value={form.bedrooms || ""} onChangeText={text => setForm({ ...form, bedrooms: text })} keyboardType="numeric" />
        <FormInput label="" placeholder="عدد الحمامات" value={form.bathrooms || ""} onChangeText={text => setForm({ ...form, bathrooms: text })} keyboardType="numeric" />
        <FormTextarea placeholder="الوصف" value={form.description || ""} onChangeText={text => setForm({ ...form, description: text })} />

        {/* Image Picker */}
        <ImagePickerButton images={selectedImages} setImages={setSelectedImages} maxImages={5} />

        {/* Submit */}
        <SubmitButton loading={isSubmitting} onPress={handleSubmit} title="أضف المزرعة" />

        {/* Toast */}
        {toast.visible && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              padding: 12,
              borderRadius: 8,
              backgroundColor: toast.type === "success" ? "#16a34a" : "#dc2626",
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>{toast.message}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
