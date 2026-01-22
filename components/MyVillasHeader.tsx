import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text } from "react-native";

export default function MyVillasHeader() {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.15)"]}
      style={styles.container}
    >
      <Text style={styles.title}>مزارعي</Text>
      <Text style={styles.subtitle}>إدارة المزارع الخاصة بك</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    color: "#eee",
    marginTop: 4,
  },
});
