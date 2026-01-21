export interface Farm {
    _id: string;
    name: string;
    type: "sale" | "rent";
    price?: number;
    weekendPrice?: number;
    images?: string[];
  }
  