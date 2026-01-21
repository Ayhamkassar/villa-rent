/**
 * Application Configuration
 * Centralized configuration for the entire app
 */

export const API_URL = "https://api-villa-rent.onrender.com";

export const APP_CONFIG = {
  appName: "Villa Rent",
  version: "1.0.0",
  defaultLanguage: "ar",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER_ID: "userId",
  IS_ADMIN: "isAdmin",
};

export const ROUTES = {
  // Auth routes
  LOGIN: "/pages/Login/Login",
  REGISTER: "/pages/Login/Register",
  FORGOT_PASSWORD: "/pages/Login/ForgotPassword",
  RESET_PASSWORD: "/pages/Login/ResetPassword",
  
  // User routes
  FARM_LIST: "/pages/mainScreens/FarmListScreen",
  MY_VILLAS: "/pages/mainScreens/MyVillas",
  PROFILE: "/pages/mainScreens/profile",
  VILLA_DETAILS: "/pages/mainScreens/VillaDetails",
  EDIT_MY_VILLA: "/pages/mainScreens/EditMyVilla",
  SETTINGS: "/pages/settings",
  
  // Admin routes
  ADMIN_ADD_VILLA: "/pages/Admin/villas/addVilla",
  ADMIN_VILLAS_LIST: "/pages/Admin/villas/VillasList",
  ADMIN_VILLA_DETAILS: "/pages/Admin/villas/VillaDetails",
  ADMIN_EDIT_VILLA: "/pages/Admin/villas/editVilla",
  ADMIN_USERS: "/pages/Admin/users/displayUsers",
  ADMIN_USER_DETAILS: "/pages/Admin/users/UserDetails",
  ADMIN_PROFILE: "/pages/Admin/profile",
  
  // Farm details
  FARM_DETAILS: "/FarmDetails",
  CONFIRM_BOOKING: "/FarmDetails/ConfirmBooking",
  
  // About
  ABOUT: "/pages/About/About",
  ABOUT_APP: "/pages/About/Aboutapp",
};
