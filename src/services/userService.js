/**
 * User Service
 * Handles all user-related API calls
 */

import api, { getFormDataConfig } from './api';
import { API_URL } from '../config';

/**
 * Get all users (admin only)
 * @returns {Promise<Array>}
 */
export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<object>}
 */
export const getUserById = async (userId) => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} userData - User data to update
 * @returns {Promise<object>}
 */
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/api/users/${userId}`, userData);
  return response.data;
};

/**
 * Update user name
 * @param {string} userId - User ID
 * @param {string} name - New name
 * @returns {Promise<object>}
 */
export const updateUserName = async (userId, name) => {
  return updateUser(userId, { name: name.trim() });
};

/**
 * Update user email
 * @param {string} userId - User ID
 * @param {string} email - New email
 * @returns {Promise<object>}
 */
export const updateUserEmail = async (userId, email) => {
  return updateUser(userId, { email: email.trim() });
};

/**
 * Upload user profile image
 * @param {string} userId - User ID
 * @param {object} image - Image object with uri
 * @returns {Promise<object>}
 */
export const uploadProfileImage = async (userId, image) => {
  const formData = new FormData();
  formData.append('profileImage', {
    uri: image.uri,
    name: 'profile.jpg',
    type: 'image/jpeg',
  });
  
  const response = await api.post(
    `/api/users/upload/${userId}`,
    formData,
    getFormDataConfig()
  );
  return response.data;
};

/**
 * Delete user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<object>}
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/users/${userId}`);
  return response.data;
};

/**
 * Get profile image URL
 * @param {string} imagePath - Profile image path
 * @returns {string}
 */
export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};
