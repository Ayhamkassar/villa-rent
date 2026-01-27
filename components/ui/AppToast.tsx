import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";

export type ToastType = "success" | "error" | "info";

interface AppToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onHide: () => void;
}

export default function AppToast({
  visible,
  message,
  type = "info",
  onHide,
}: AppToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(onHide);
    }, 2200);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const bg =
    type === "success"
      ? "#22C55E"
      : type === "error"
      ? "#EF4444"
      : "#2563EB";

  return (
    <Animated.View style={[styles.toast, { opacity, backgroundColor: bg }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
    zIndex: 9999,
    elevation: 20,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
