import { Platform } from "react-native";
import { VillaFormData } from "../types/types";

export const formDataToMultipart = (formData: VillaFormData) => {
  const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (key === "images") return;
    data.append(key, value || "");
  });

  formData.images.forEach((img, i) =>
    data.append("images", {
        uri: Platform.OS === "android" ? img.uri : img.uri.replace("file://", ""),
        name: img.name || `image${i}.jpeg`,
        type: img.type || "image/jpeg",
      } as unknown as Blob));
      
  return data;
};
