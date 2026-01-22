import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SubmitButton({ onPress, loading, title }: any) {
  return loading ? (
    <ActivityIndicator size="large" color="#2ecc71" style={{ marginBottom: 40 }} />
  ) : (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: "#065f46", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginBottom: 40 },
  text: { color: "white", fontWeight: "bold", fontSize: 18 },
});
