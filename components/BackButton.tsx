import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BackButton({ onPress }: any) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <Text style={styles.backText}>رجوع</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#0077b6",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  backText: { color: "#fff", fontWeight: "bold" },
});
