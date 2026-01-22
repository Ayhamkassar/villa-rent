export interface Farm {
  _id: string;
  name: string;
  price?: number;
  midweekPrice?: number;
  type: "rent" | "sale";
  images?: string[];
  ownerId?: string | { _id: string };
}

