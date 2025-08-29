import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/server/config";

export default function AddFarm() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
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
    ownerId: "",
    contactNumber: "",
  });
  useEffect(() => {
    if (formData.type === "rent") {
      setFormData((prev) => ({
        ...prev,
        price: "0",
        sizeInHectares: "0",
      }));
    } else if (formData.type === "sale") {
      setFormData((prev) => ({
        ...prev,
        guests: "0",
        bedrooms: "0",
        bathrooms: "0",
        midweekPrice: "0",
        weekendPrice: "0",
      }));
    }
  }, [formData.type]);
  useEffect(() => {
    fetchUsers();
  }, []);
  

  const fetchUsers = async () => {
        try {
          const token = await AsyncStorage.getItem("token"); // جلب التوكن
          if (!token) {
            Alert.alert("تنبيه", "لم يتم تسجيل الدخول");
            return;
          }
      
          const res = await axios.get(`${API_URL}/api/users`, {
            headers: {
              "Content-Type": "multipart/form-data",
               Authorization: `Bearer ${token}`
               },
          });
      
          setUsers(res.data); // تعيين قائمة المستخدمين
        } catch (error) {
          console.error(error);
          Alert.alert("خطأ", "فشل في جلب قائمة المستخدمين");
        }
      };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImages = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("نحتاج صلاحية الوصول إلى الصور!");
        return;
      }
    }
  
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
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
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...selectedImages],
        }));
      }
    } catch (error) {
      console.log(error);
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الصور.");
    }
  };
  

  const handleSubmit = async () => {
    if (!formData.ownerId) {
      Alert.alert("تنبيه", "يرجى اختيار صاحب المزرعة");
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
    data.append("ownerId", formData.ownerId);
    data.append("contactNumber", formData.contactNumber || "");
    if (formData.type === "sale") data.append("sizeInHectares", formData.sizeInHectares || 0);
  
    formData.images.forEach((image, index) => {
      data.append("images", {
        uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
        name: image.name || `image${index}.jpeg`,
        type: image.type || "image/jpeg",
      });
    });
    
  
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/villa`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("نجاح", "تمت إضافة المزرعة بنجاح!");
      console.log(formData)
      setFormData({
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
        ownerId: "",
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert("خطأ", "حدث خطأ أثناء الإضافة.");
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>إضافة مزرعة جديدة 🌴</Text>

        {/* اختيار مالك المزرعة */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>اختر صاحب المزرعة:</Text>
          <Picker
            selectedValue={formData.ownerId}
            onValueChange={(value) => handleChange("ownerId", value)}
            style={styles.picker}
          >
            <Picker.Item label="اختر مالك المزرعة" value="" />
            {users.map((user) => (
              <Picker.Item
                key={user._id}
                label={user.name}
                value={user._id}
              />
            ))}
          </Picker>
        </View>

        {/* باقي الحقول */}
        <TextInput
          style={styles.input}
          placeholder="اسم المزرعة *"
          value={formData.title}
          onChangeText={(text) => handleChange("title", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="العنوان"
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
        />
        <TextInput
  style={styles.input}
  placeholder="رقم التواصل(واتساب)"
  keyboardType="phone-pad"
  value={formData.contactNumber}
  onChangeText={(text) => handleChange("contactNumber", text)}
/>

        {formData.type === "sale" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="المساحة (هكتار)"
              keyboardType="numeric"
              value={formData.sizeInHectares}
              onChangeText={(text) => handleChange("sizeInHectares", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="السعر *"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={(text) => handleChange("price", text)}
            />
          </>
        )}

        {formData.type === "rent" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="عدد الضيوف"
              keyboardType="numeric"
              value={formData.guests}
              onChangeText={(text) => handleChange("guests", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="عدد غرف النوم"
              keyboardType="numeric"
              value={formData.bedrooms}
              onChangeText={(text) => handleChange("bedrooms", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="عدد الحمامات"
              keyboardType="numeric"
              value={formData.bathrooms}
              onChangeText={(text) => handleChange("bathrooms", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="سعر منتصف الأسبوع"
              keyboardType="numeric"
              value={formData.midweekPrice}
              onChangeText={(text) => handleChange("midweekPrice", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="سعر نهاية الأسبوع"
              keyboardType="numeric"
              value={formData.weekendPrice}
              onChangeText={(text) => handleChange("weekendPrice", text)}
            />
          </>
        )}

        <View style={styles.pickerRow}>
          <Text style={styles.label}>حالة المزرعة:</Text>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === "sale" && styles.typeButtonActive,
            ]}
            onPress={() => handleChange("type", "sale")}
          >
            <Text
              style={[
                styles.typeButtonText,
                formData.type === "sale" && styles.typeButtonTextActive,
              ]}
            >
              بيع
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              formData.type === "rent" && styles.typeButtonActive,
            ]}
            onPress={() => handleChange("type", "rent")}
          >
            <Text
              style={[
                styles.typeButtonText,
                formData.type === "rent" && styles.typeButtonTextActive,
              ]}
            >
              إيجار
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          placeholder="الوصف"
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
          <Text style={styles.imagePickerText}>
            {formData.images.length > 0
              ? `تم اختيار ${formData.images.length} صورة`
              : "اختر صور المزرعة"}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#2ecc71" />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>أضف المزرعة</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#a7d8f7",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#065f46",
    alignSelf: "center",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#0f766e",
    borderWidth: 1,
    textAlign: "right",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#0f766e",
    borderRadius: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
    color: "#064e3b",
  },
  typeButton: {
    borderWidth: 1,
    borderColor: "#0f766e",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "transparent",
  },
  typeButtonActive: {
    backgroundColor: "#0f766e",
  },
  typeButtonText: {
    color: "#0f766e",
    fontWeight: "bold",
  },
  typeButtonTextActive: {
    color: "white",
  },
  imagePicker: {
    backgroundColor: "#0f766e",
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  imagePickerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#065f46",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
