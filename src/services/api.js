/**
 * API Service
 * Centralized axios instance with interceptors
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, STORAGE_KEYS } from '../config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token expired or invalid - clear storage
        AsyncStorage.multiRemove([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.USER_ID,
          STORAGE_KEYS.IS_ADMIN,
        ]);
      }
      
      return Promise.reject({
        status,
        message: data?.message || 'حدث خطأ في الخادم',
        data,
      });
    } else if (error.request) {
      // No response received
      return Promise.reject({
        status: 0,
        message: 'لا يمكن الاتصال بالخادم',
      });
    } else {
      return Promise.reject({
        status: -1,
        message: error.message || 'حدث خطأ غير متوقع',
      });
    }
  }
);

/**
 * Create FormData request config
 */
export const getFormDataConfig = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default api;
