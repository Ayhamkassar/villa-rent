import { FarmFilter } from "@/hooks/useFarms";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import AnimatedScreen from "../../../components/AnimatedScreen";
import BottomNav from "../../../components/BottomNav";
import FarmCard from "../../../components/FarmCard";
import { useFarms } from "../../../hooks/useFarms";

export default function FarmListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FarmFilter>("all");
  const [search, setSearch] = useState("");

  const {
    farms,
    loading,
    refreshing,
    fetchFarms,
    onRefresh,
  } = useFarms(filter, search);
  
    

  return (
    <AnimatedScreen animationType="slideInUp" duration={500}>
      <LinearGradient colors={["#74EBD5", "#ACB6E5"]} style={styles.container}>
        <View style={styles.overlay}>
          {/* SEARCH */}
          <TextInput
            placeholder="Search for farms or villas..."
            value={search}
            onChangeText={setSearch}
            style={styles.search}
            onSubmitEditing={onRefresh}
          />

          {/* LIST */}
          <FlatList
            data={farms}
            keyExtractor={(item) => item._id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <FarmCard
                farm={item}
                onPress={() =>
                  router.push(`/FarmDetails/${item._id}`)
                }
              />
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>

        <BottomNav />
      </LinearGradient>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { padding: 16 },
  search: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
});
