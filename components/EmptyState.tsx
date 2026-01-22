import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.15)"]}
      style={styles.container}
    >
      <Text style={styles.title}>لا توجد مزارع مضافة</Text>
      <Text style={styles.subtitle}>
        ابدأ بإضافة مزرعتك الأولى لتظهر هنا
      </Text>

      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          إضافة مزرعة جديدة
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 26,
    padding: 30,
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ecf0f1",
    marginVertical: 12,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 10,
  },
});
