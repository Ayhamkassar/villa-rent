import { API_URL } from "@/server/config";
import axios from "axios";
import { useEffect, useState } from "react";

export type FarmFilter = "all" | "sale" | "rent";

export const useFarms = (
  filter: FarmFilter,
  search: string
) => {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFarms = async () => {
    try {
      setLoading(true);

      let url = `${API_URL}/api/farms?`;

      if (filter !== "all") {
        url += `type=${filter}&`;
      }

      if (search.trim() !== "") {
        url += `search=${encodeURIComponent(search)}&`;
      }

      const res = await axios.get(url);
      setFarms(Array.isArray(res.data?.farms) ? res.data.farms : []);
    } catch (error) {
      console.log("fetch farms error", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFarms();
  };

  useEffect(() => {
    fetchFarms();
  }, [filter]);

  return {
    farms,
    loading,
    refreshing,
    fetchFarms,
    onRefresh, // ✅ موجود هون
  };
};
