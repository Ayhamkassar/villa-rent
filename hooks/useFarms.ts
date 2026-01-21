import { API_URL } from "@/server/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Farm } from "../types/farms";

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "sale" | "rent">("all");
  const [search, setSearch] = useState("");

  const fetchFarms = async () => {
    setLoading(true);
    let url = `${API_URL}/api/farms?`;

    if (filter !== "all") url += `type=${filter}&`;
    if (search.trim()) url += `search=${search}`;

    const res = await axios.get(url);
    setFarms(res.data?.farms || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFarms();
  }, [filter]);

  return {
    farms,
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    fetchFarms,
  };
}
