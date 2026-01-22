import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AddVillaFAB({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <LinearGradient
        colors={["#27AE60", "#2ECC71"]}
        style={styles.button}
      >
        <Text style={styles.plus}>＋</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 95,
    right: 25,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  plus: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },
});
