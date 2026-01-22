export interface User {
    _id: string;
    name: string;
    email: string;
  
    profileImage?: string;
    phone?: string;
    location?: string;
  
    isAdmin?: boolean;
    isVerified?: boolean;
  
    createdAt?: string;
    updatedAt?: string;
  }
  