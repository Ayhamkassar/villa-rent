import MyVillasHeader from "@/components/MyVillasHeader";
import VillaCard from "@/components/VillaCard";
import { useMyVillas } from "@/hooks/useMyVillas";
import { LinearGradient } from "expo-linear-gradient"; // ✅ استدعاء التدريج
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
} from "react-native";
import AnimatedScreen from "../../../components/AnimatedScreen";
import BottomNav from "../../../components/BottomNav";



export default function MyVillasScreen() {
  const router = useRouter();
  const { farms, loading, refreshing, onRefresh } = useMyVillas();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return (
    <AnimatedScreen animationType="slideInLeft">
      <LinearGradient colors={["#74EBD5", "#ACB6E5"]} style={{ flex: 1 }}>
        <View style={{ padding: 16, paddingBottom: 90 }}>

          <MyVillasHeader />
          <FlatList
            data={farms}
            keyExtractor={(item,index) => item._id || index.toString()}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) =>{
              console.log("Villa item:", item);

              return(
              <VillaCard
                villa={item}
                onPress={() =>
                  router.push(`/pages/mainScreens/VillaDetails?id=${item._id}`)
                }
                onEdit={() =>
                  router.push(`/pages/mainScreens/EditMyVilla?id=${item._id}`)
                }
              />
            )}}
          />

        </View>

        <BottomNav />
      </LinearGradient>
    </AnimatedScreen>
  );
}
