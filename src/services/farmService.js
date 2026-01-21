/**
 * Farm Service
 * Handles all farm/villa related API calls
 */

import { Platform } from 'react-native';
import api, { getFormDataConfig } from './api';
import { API_URL } from '../config';

/**
 * Get all farms with optional filters
 * @param {object} filters - Optional filters
 * @param {string} filters.type - Farm type (all, sale, rent)
 * @param {string} filters.search - Search query
 * @returns {Promise<Array>}
 */
export const getFarms = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.type && filters.type !== 'all') {
    params.append('type', filters.type);
  }
  if (filters.search && filters.search.trim()) {
    params.append('search', filters.search.trim());
  }
  
  const queryString = params.toString();
  const url = queryString ? `/api/farms?${queryString}` : '/api/farms';
  
  const response = await api.get(url);
  return Array.isArray(response.data?.farms) ? response.data.farms : [];
};

/**
 * Get farm by ID
 * @param {string} farmId - Farm ID
 * @returns {Promise<object>}
 */
export const getFarmById = async (farmId) => {
  const response = await api.get(`/api/farms/${farmId}`);
  return response.data;
};

/**
 * Get farms by owner ID
 * @param {string} ownerId - Owner user ID
 * @returns {Promise<Array>}
 */
export const getFarmsByOwner = async (ownerId) => {
  const allFarms = await getFarms();
  return allFarms.filter(
    (farm) => farm.ownerId === ownerId || farm.ownerId?._id === ownerId
  );
};

/**
 * Create new farm
 * @param {object} farmData - Farm data
 * @returns {Promise<object>}
 */
export const createFarm = async (farmData) => {
  const formData = new FormData();
  
  formData.append('name', farmData.title);
  formData.append('description', farmData.description);
  formData.append('address', JSON.stringify(farmData.address || ''));
  formData.append('price', farmData.price || 0);
  formData.append('type', farmData.type);
  formData.append('status', farmData.status);
  formData.append('guests', farmData.guests || 0);
  formData.append('bedrooms', farmData.bedrooms || 0);
  formData.append('bathrooms', farmData.bathrooms || 0);
  formData.append('midweekPrice', farmData.midweekPrice || 0);
  formData.append('weekendPrice', farmData.weekendPrice || 0);
  formData.append('ownerId', farmData.ownerId);
  formData.append('contactNumber', farmData.contactNumber || '');
  formData.append('startBookingTime', farmData.startBookingTime || '');
  formData.append('endBookingTime', farmData.endBookingTime || '');
  
  if (farmData.type === 'sale') {
    formData.append('sizeInHectares', farmData.sizeInHectares || 0);
  }
  
  // Append images
  if (farmData.images && farmData.images.length > 0) {
    farmData.images.forEach((image, index) => {
      formData.append('images', {
        uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
        name: image.name || `image${index}.jpeg`,
        type: image.type || 'image/jpeg',
      });
    });
  }
  
  const response = await api.post('/api/villa', formData, getFormDataConfig());
  return response.data;
};

/**
 * Update farm
 * @param {string} farmId - Farm ID
 * @param {object} farmData - Farm data to update
 * @returns {Promise<object>}
 */
export const updateFarm = async (farmId, farmData) => {
  const formData = new FormData();
  
  Object.keys(farmData).forEach((key) => {
    if (key === 'images' && Array.isArray(farmData[key])) {
      farmData[key].forEach((image, index) => {
        if (image.uri) {
          formData.append('images', {
            uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
            name: image.name || `image${index}.jpeg`,
            type: image.type || 'image/jpeg',
          });
        }
      });
    } else if (key === 'address') {
      formData.append(key, JSON.stringify(farmData[key]));
    } else if (farmData[key] !== undefined && farmData[key] !== null) {
      formData.append(key, farmData[key]);
    }
  });
  
  const response = await api.put(`/api/farms/${farmId}`, formData, getFormDataConfig());
  return response.data;
};

/**
 * Delete farm
 * @param {string} farmId - Farm ID
 * @returns {Promise<object>}
 */
export const deleteFarm = async (farmId) => {
  const response = await api.delete(`/api/farms/${farmId}`);
  return response.data;
};

/**
 * Get price quote for booking
 * @param {string} farmId - Farm ID
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @returns {Promise<{totalPrice: number}>}
 */
export const getQuote = async (farmId, fromDate, toDate) => {
  const response = await api.post(`/api/farms/quote/${farmId}`, {
    from: fromDate,
    to: toDate,
  });
  return response.data;
};

/**
 * Get image URL for a farm image
 * @param {string} imageId - Image ID or URL
 * @returns {string}
 */
export const getImageUrl = (imageId) => {
  if (!imageId) return 'https://via.placeholder.com/150';
  if (imageId.toString().startsWith('http')) return imageId;
  return `${API_URL}/api/images/${imageId}`;
};
