import { useState } from "react";
import { createFarm } from "@/services/farm.service";
import { FarmPayload, FarmType } from "@/types/Farm";

export const useAddFarm = () => {
  const [loading, setLoading] = useState(false);

  const submitFarm = async (payload: FarmPayload) => {
    try {
      setLoading(true);
      await createFarm(payload);
      return true;
    } catch (error) {
      console.log("ADD FARM ERROR:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitFarm, loading };
};
