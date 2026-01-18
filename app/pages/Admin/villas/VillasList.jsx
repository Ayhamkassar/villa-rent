import { API_URL } from "@/server/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../../../../components/BottomNav";


export default function VillasList() {
  const router = useRouter();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const fetchAuthStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (!token || !userId) {
        Alert.alert("تنبيه", "الرجاء تسجيل الدخول كمسؤول");
        router.replace("/pages/Login/Login");
        return false;
      }
      const { data } = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data?.isAdmin) {
        Alert.alert("غير مصرح", "هذه الصفحة للمسؤولين فقط");
        router.replace("/pages/mainScreens/FarmListScreen");
        return false;
      }
      setIsAdmin(true);
      return true;
    } catch (err) {
      console.error(err);
      Alert.alert("خطأ", "فشل في التحقق من الصلاحيات");
      return false;
    }
  }, [router]);

  const fetchFarms = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/farms`);
      setFarms(res.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
      Alert.alert("خطأ", "فشل في تحميل المزارع");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const ok = await fetchAuthStatus();
      if (ok) {
        fetchFarms();
      } else {
        setLoading(false);
      }
    })();
  }, [fetchAuthStatus, fetchFarms]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFarms();
  };

  const confirmAndDelete = async (farmId) => {
    Alert.alert('تأكيد', 'هل تريد حذف هذه المزرعة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف', style: 'destructive', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              Alert.alert('تنبيه', 'يرجى تسجيل الدخول');
              return;
            }
            await axios.delete(`${API_URL}/api/farms/${farmId}`, { headers: { Authorization: `Bearer ${token}` } });
            setFarms((prev) => prev.filter((f) => f._id !== farmId));
            Alert.alert('تم', 'تم حذف المزرعة بنجاح');
          } catch (err) {
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            Alert.alert('خطأ', serverMsg || err.message || 'فشل حذف المزرعة');
          }
        }
      }
    ]);
  };

  const renderFarm = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: "/pages/Admin/villas/VillaDetails", params: { id: item._id } })}>
      <Image
        source={{
          uri:
            item.images && item.images.length > 0
              ? item.images[0].toString().startsWith("http")
                ? item.images[0]
                : `${API_URL}/api/images/${item.images[0]}`
              : "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        {item.type === "rent" ? (
          <Text style={styles.price}>{item.price || "-"} ليرة</Text>
        ) : (
          <Text style={styles.price}>{item.price || "-"} ليرة</Text>
        )}
        <Text style={styles.description} numberOfLines={2}>
          {item.type === "rent" ? "إيجار" : "بيع"}
        </Text>
      </View>
      {isAdmin && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={() => router.push({ pathname: "/pages/Admin/villas/editVilla", params: { id: item._id } })}>
            <Text style={styles.editText}>تعديل</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => confirmAndDelete(item._id)}>
            <Text style={styles.deleteText}>حذف</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <LinearGradient
    colors={['#74ebd5', '#ACB6E5']} // سماوي ↔ بنفسجي فاتح
    style={{ flex: 1 }}
  >
      <View style={styles.overlay}>
        <FlatList
          data={farms}
          renderItem={renderFarm}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>لا توجد مزارع للعرض حالياً</Text>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#27ae60"]} />
          }
        />
      </View>
      <BottomNav />
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", padding: 15, paddingBottom: 80 },
  listContent: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  cardContent: { flex: 1, marginLeft: 10, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  price: { fontSize: 16, color: "#27ae60", marginVertical: 4 },
  description: { fontSize: 14, color: "#7f8c8d" },
  emptyText: { color: "#fff", textAlign: "center", marginTop: 20, fontSize: 16 },
  editButton: {
    backgroundColor: "#065f46",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editText: { color: "#fff", fontWeight: "bold" },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteButton: { backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginLeft: 8 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});


