export type VillaType = "sale" | "rent";

export interface VillaFormData {
  title: string;
  description: string;
  address: string;
  sizeInHectares: string;
  price: string;
  type: VillaType;
  status: string;
  images: VillaImage[];
  guests: string;
  bedrooms: string;
  bathrooms: string;
  midweekPrice: string;
  weekendPrice: string;
  contactNumber: string;
}

export interface VillaImage {
  uri: string;
  name: string;
  type: string;
}
