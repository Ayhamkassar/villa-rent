import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/**
 * Bottom navigation bar.
 * - For normal users: Home, MyVillas, Profile
 * - For admins: AddVilla, Villas, Users, Profile
 */
export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, true/false = role

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const flag = await AsyncStorage.getItem("isAdmin");
        if (!isMounted) return;
        setIsAdmin(flag === "true");
      } catch (e) {
        console.warn("Failed to read isAdmin from storage", e);
        if (isMounted) setIsAdmin(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAdmin === null) return null; // don't flash while loading role

  const userTabs = [
    {
      key: "home",
      label: "الرئيسية",
      icon: "home-outline",
      route: "/pages/mainScreens/FarmListScreen",
    },
    {
      key: "myVillas",
      label: "مزارعي",
      icon: "leaf-outline",
      route: "/pages/mainScreens/MyVillas",
    },
    {
      key: "profile",
      label: "الملف",
      icon: "person-circle-outline",
      route: "/pages/mainScreens/profile",
    },
  ];

  const adminTabs = [
    {
      key: "addVilla",
      label: "إضافة مزرعة",
      icon: "add-circle-outline",
      route: "/pages/Admin/villas/addVilla",
    },
    {
      key: "villas",
      label: "المزارع",
      icon: "home-outline",
      route: "/pages/Admin/villas/VillasList",
    },
    {
      key: "users",
      label: "المستخدمون",
      icon: "people-outline",
      route: "/pages/Admin/users/displayUsers",
    },
    {
      key: "profile",
      label: "الملف",
      icon: "person-circle-outline",
      route: "/pages/Admin/profile",
    },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

  const handlePress = (route) => {
    if (!pathname || !pathname.startsWith(route)) {
      router.replace(route);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const active = pathname && pathname.startsWith(tab.route);
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.8}
              onPress={() => handlePress(tab.route)}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                color={active ? "#000000" : "#111827"}
              />
              <Text style={[styles.label, active && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const TAB_HEIGHT = 64;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: Platform.OS === "ios" ? 12 : 8,
    paddingHorizontal: 12,
  },
  container: {
    height: TAB_HEIGHT,
    backgroundColor: "rgba(116,235,213,0.95)", // teal from app gradient
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    color: "#0f172a", // slate-900 for contrast on light teal
  },
  labelActive: {
    color: "#111827", // slightly darker when active
    fontWeight: "700",
  },
});
