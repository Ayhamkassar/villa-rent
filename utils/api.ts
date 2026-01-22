import { API_URL } from "@/server/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const getToken = async () => await AsyncStorage.getItem("token");

export const fetchVilla = async (id: any) => {
  const token = await getToken();
  return axios.get(`${API_URL}/api/farms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateVilla = async (id: any, data: any) => {
  const token = await getToken();
  return axios.put(`${API_URL}/api/farms/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
  });
};
