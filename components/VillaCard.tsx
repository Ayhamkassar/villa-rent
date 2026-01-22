import { API_URL } from "@/server/config";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VillaCard({ villa, onEdit, onPress }: any) {
  const image =
    villa.images?.[0]?.startsWith("http")
      ? villa.images[0]
      : `${API_URL}/api/images/${villa.images?.[0]}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{villa.name}</Text>

        <Text style={styles.price}>
          {villa.type === "rent"
            ? villa.midweekPrice || "-"
            : villa.price || "-"}
        </Text>

        <Text style={styles.type}>
          {villa.type === "rent" ? "إيجار" : "بيع"}
        </Text>
      </View>

      <TouchableOpacity style={styles.edit} onPress={onEdit}>
        <Text style={{ color: "#fff" }}>تعديل</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  price: {
    color: "#27AE60",
    marginVertical: 4,
  },
  type: {
    color: "#7f8c8d",
  },
  edit: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
