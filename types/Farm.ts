export type FarmType = "rent" | "sale";

export interface FarmPayload {
  name: string;
  address: string;
  contact: string;
  ownerId: string;
  type: FarmType;
  size?: string;
  salePrice?: string;
  guests?: string;
  bedrooms?: string;
  bathrooms?: string;
  midweekPrice?: string;
  weekendPrice?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  images: string[];
}
