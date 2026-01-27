import axios from "axios";
import { FarmPayload } from "@/types/Farm";
import { API_URL } from "@/server/config";

export const createFarm = async (data: FarmPayload) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "images") {
      formData.append(key, String(value));
    }
  });

  data.images.forEach((uri, index) => {
    formData.append("images", {
      uri,
      name: `farm_${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const res = await axios.post(`${API_URL}/farms`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
