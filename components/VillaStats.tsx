import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  total: number;
  rent: number;
  sale: number;
}

export default function VillasStats({ total, rent, sale }: Props) {
  return (
    <View style={styles.row}>
      <StatCard title="الكل" value={total} colors={["#27AE60", "#2ECC71"]} />
      <StatCard title="إيجار" value={rent} colors={["#3498DB", "#5DADE2"]} />
      <StatCard title="بيع" value={sale} colors={["#E67E22", "#F39C12"]} />
    </View>
  );
}

function StatCard({
  title,
  value,
  colors,
}: {
  title: string;
  value: number;
  colors: readonly [string, string, ...string[]];
}) {
  return (
    <LinearGradient colors={colors} style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  value: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    color: "#fff",
    marginTop: 4,
    fontSize: 13,
  },
});
