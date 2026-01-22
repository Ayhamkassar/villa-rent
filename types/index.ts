export type FarmType = 'rent' | 'sale';

export interface Owner {
  id: string;
  name: string;
}

export interface FarmFormData {
  name: string;
  address: string;
  contact: string;
  size: string;
  salePrice: string;
  guests: string;
  bedrooms: string;
  bathrooms: string;
  midweekPrice: string;
  weekendPrice: string;
  startTime: string;
  endTime: string;
  description: string;
}
