import { API_URL } from "@/server/config";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FarmCard({ farm, onPress }: any) {
  const image =
    farm.images?.length > 0
      ? farm.images[0].startsWith("http")
        ? farm.images[0]
        : `${API_URL}/api/images/${farm.images[0]}`
      : "https://via.placeholder.com/400";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* IMAGE */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />

        {/* BADGE */}
        <LinearGradient
          colors={
            farm.type === "rent"
              ? ["#27AE60", "#2ECC71"]
              : ["#3498DB", "#5DADE2"]
          }
          style={styles.badge}
        >
          <Text style={styles.badgeText}>
            {farm.type === "rent" ? "For Rent" : "For Sale"}
          </Text>
        </LinearGradient>

        {/* FAVORITE */}
        <View style={styles.favorite}>
          <AntDesign name="heart" size={18} color="#333" />
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>{farm.name}</Text>

        <View style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#777" />
          <Text style={styles.locationText}>{farm.location || "Syria"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.price}>
            {farm.type === "rent"
              ? `${farm.weekendPrice || "-"} SYP`
              : `${farm.price || "-"} USD`}
          </Text>

          <View style={styles.rating}>
            <Text>⭐</Text>
            <Text style={{ fontWeight: "600" }}>
              {farm.rating || "4.8"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
  },
  imageWrapper: { height: 220 },
  image: { width: "100%", height: "100%" },

  badge: {
    position: "absolute",
    top: 15,
    left: 15,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: "#fff", fontWeight: "600" },

  favorite: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 6 },

  location: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: { marginLeft: 4, color: "#777" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#27AE60",
  },

  rating: { flexDirection: "row", gap: 4 },
});
