import { API_URL } from "@/server/config";
import { Farm } from "@/types/Farm";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
export function useMyVillas() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const ownerId = await AsyncStorage.getItem("userId");
      if (!ownerId) {
        Alert.alert("خطأ", "يرجى تسجيل الدخول");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/farms`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const myFarms = res.data.farms.filter((f: any) => {
        const farmOwnerId = typeof f.ownerId === "string" ? f.ownerId : f.ownerId?._id;
        return farmOwnerId?.toString() === ownerId?.toString();
      });

      setFarms(myFarms);
    } catch (err: any) {
      Alert.alert("خطأ", "فشل تحميل المزارع");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFarms();
  };

  return { farms, loading, refreshing, onRefresh };
}
