import { API_URL } from "@/server/config";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FarmListBG from "../../../assets/farmlistbg.png";

const FarmListScreen = () => {
  const router = useRouter();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all | sale | rent
  const [search, setSearch] = useState("");   // نص البحث

  const fetchFarms = async () => {
    try {
      setLoading(true);

      // بناء الرابط مع query params
      let url = `${API_URL}/api/farms?`;
      if (filter !== "all") {
        url += `type=${filter}&`;
      }
      if (search.trim() !== "") {
        url += `search=${encodeURIComponent(search)}&`;
      }

      const res = await axios.get(url);
      setFarms(res.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
      Alert.alert("خطأ", "فشل في تحميل المزارع");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFarms(); // أول مرة بس
  }, [filter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFarms();
  };

  const renderFarm = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/FarmDetails/${item._id}`)}
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
          <Text style={styles.price}>{item.weekendPrice || "-"} ليرة</Text>
        ) : (
          <Text style={styles.price}>{item.price || "-"} دولار</Text>
        )}
        <Text style={styles.description} numberOfLines={2}>
          {item.type === "rent" ? "إيجار" : "بيع"}
        </Text>
      </View>
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
    <ImageBackground
      source={FarmListBG}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* مربع البحث + زر بحث */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن مزرعة..."
            placeholderTextColor="#ccc"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchFarms}>
            <Text style={styles.searchButtonText}>بحث</Text>
          </TouchableOpacity>
        </View>

        {/* أزرار الفلترة */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "all" && styles.activeFilter]}
            onPress={() => setFilter("all")}
          >
            <Text style={styles.filterText}>الكل</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "sale" && styles.activeFilter]}
            onPress={() => setFilter("sale")}
          >
            <Text style={styles.filterText}>بيع</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "rent" && styles.activeFilter]}
            onPress={() => setFilter("rent")}
          >
            <Text style={styles.filterText}>إيجار</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={farms}
          renderItem={renderFarm}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {search.trim() !== "" ? "ما في نتائج بهالاسم" : "لا توجد مزارع للعرض حالياً"}
            </Text>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", padding: 15 },
  listContent: { paddingBottom: 20 },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    color: "#2c3e50",
  },
  searchButton: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeFilter: {
    backgroundColor: "#27ae60",
  },
  filterText: {
    color: "#2c3e50",
    fontWeight: "bold",
  },

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
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  cardContent: { flex: 1, marginLeft: 10, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  price: { fontSize: 16, color: "#27ae60", marginVertical: 4 },
  description: { fontSize: 14, color: "#7f8c8d" },
  emptyText: { color: "#fff", textAlign: "center", marginTop: 20, fontSize: 16 },
});

export default FarmListScreen;
