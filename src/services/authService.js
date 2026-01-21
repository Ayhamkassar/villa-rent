/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { STORAGE_KEYS } from '../config';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  const response = await api.post('/api/login', { email, password });
  const { token, user } = response.data;
  
  // Store auth data
  await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, user.id);
  await AsyncStorage.setItem(STORAGE_KEYS.IS_ADMIN, (user.isAdmin || false).toString());
  
  return { token, user };
};

/**
 * Register new user
 * @param {object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<object>}
 */
export const register = async ({ name, email, password }) => {
  const response = await api.post('/api/register', { name, email, password });
  return response.data;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<object>}
 */
export const forgotPassword = async (email) => {
  const response = await api.post('/api/forgot-password', { email });
  return response.data;
};

/**
 * Reset password with OTP
 * @param {string} email - User email
 * @param {string} otp - One-time password
 * @param {string} newPassword - New password
 * @returns {Promise<object>}
 */
export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post('/api/reset-password', {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

/**
 * Logout user - clear all stored auth data
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.USER_ID,
    STORAGE_KEYS.IS_ADMIN,
  ]);
};

/**
 * Check if user is authenticated
 * @returns {Promise<{isAuthenticated: boolean, isAdmin: boolean, userId: string|null}>}
 */
export const checkAuth = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    const isAdmin = await AsyncStorage.getItem(STORAGE_KEYS.IS_ADMIN);
    
    return {
      isAuthenticated: !!token && !!userId,
      isAdmin: isAdmin === 'true',
      userId,
      token,
    };
  } catch (error) {
    console.error('Error checking auth:', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      userId: null,
      token: null,
    };
  }
};

/**
 * Get stored auth token
 * @returns {Promise<string|null>}
 */
export const getToken = async () => {
  return AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get stored user ID
 * @returns {Promise<string|null>}
 */
export const getUserId = async () => {
  return AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
};
