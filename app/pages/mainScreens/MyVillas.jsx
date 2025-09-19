import { API_URL } from "@/server/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient"; // ✅ استدعاء التدريج
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
import AnimatedScreen from "../../../components/AnimatedScreen";

export default function MyVillas() {
  const router = useRouter();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ownerId, setOwnerId] = useState(null);

  const fetchAuth = useCallback(async () => {
    const id = await AsyncStorage.getItem("userId");
    if (!id) {
      Alert.alert("تنبيه", "الرجاء تسجيل الدخول");
      router.replace("/pages/Login/Login");
      return null;
    }
    setOwnerId(id);
    return id;
  }, [router]);

  const fetchFarms = useCallback(async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/farms`);
      const myFarms = res.data.filter(
        (f) => f.ownerId === id || f.ownerId?._id === id
      );
      setFarms(myFarms);
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
      const id = await fetchAuth();
      if (id) {
        fetchFarms(id);
      } else {
        setLoading(false);
      }
    })();
  }, [fetchAuth, fetchFarms]);

  const onRefresh = () => {
    setRefreshing(true);
    if (ownerId) fetchFarms(ownerId);
  };

  const renderFarm = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/pages/mainScreens/VillaDetails",
          params: { id: item._id },
        })
      }
    >
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
          <Text style={styles.price}>{item.midweekPrice || "-"} ليرة</Text>
        ) : (
          <Text style={styles.price}>{item.price || "-"} ليرة</Text>
        )}
        <Text style={styles.description} numberOfLines={2}>
          {item.type === "rent" ? "إيجار" : "بيع"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/pages/mainScreens/EditMyVilla",
            params: { id: item._id },
          })
        }
      >
        <Text style={styles.editText}>تعديل</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <AnimatedScreen animationType="fadeIn" duration={300}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen animationType="slideInLeft" duration={500}>
      <LinearGradient
        colors={["#74ebd5", "#ACB6E5"]}
        style={styles.background}
      >
      <View style={styles.overlay}>
        <FlatList
          data={farms}
          renderItem={renderFarm}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>لا توجد مزارع للعرض حالياً</Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#27ae60"]}
            />
          }
        />
      </View>
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  background: { flex: 1 },
  overlay: { flex: 1, padding: 15 },
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
});
