import { API_URL } from "@/server/config";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  image?: string | null;
  onChangeImage: () => void;
}

export default function ProfileAvatar({ image, onChangeImage }: Props) {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {image ? (
          <Image
            source={{ uri: `${API_URL}${image}` }}
            style={styles.avatar}
          />
        ) : (
          <Ionicons name="person" size={60} color="#fff" />
        )}

        {/* Camera badge */}
        <LinearGradient
          colors={["#1E90FF", "#4169E1"]}
          style={styles.cameraBadge}
        >
          <Ionicons name="camera" size={18} color="#fff" />
        </LinearGradient>
      </View>

      {/* Change button */}
      <TouchableOpacity style={styles.changeBtn} onPress={onChangeImage}>
        <Ionicons name="camera" size={16} color="#fff" />
        <Text style={styles.changeText}>تغيير الصورة</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 25,
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 4,
    borderColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  changeBtn: {
    flexDirection: "row",
    backgroundColor: "#1E90FF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 6,
  },
  changeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
