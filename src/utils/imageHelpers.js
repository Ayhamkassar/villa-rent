/**
 * Image Helper Utilities
 * Functions for handling images in the app
 */

import { Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../config';

/**
 * Request media library permissions
 * @returns {Promise<boolean>}
 */
export const requestMediaLibraryPermissions = async () => {
  if (Platform.OS === 'web') return true;
  
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('تنبيه', 'نحتاج صلاحية الوصول إلى الصور!');
    return false;
  }
  return true;
};

/**
 * Pick a single image from library
 * @param {object} options - ImagePicker options
 * @returns {Promise<object|null>}
 */
export const pickSingleImage = async (options = {}) => {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) return null;
  
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      ...options,
    });
    
    if (result.canceled) return null;
    
    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.uri.split('/').pop(),
      type: getImageMimeType(asset.uri),
    };
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
    return null;
  }
};

/**
 * Pick multiple images from library
 * @param {object} options - ImagePicker options
 * @returns {Promise<Array>}
 */
export const pickMultipleImages = async (options = {}) => {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) return [];
  
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      ...options,
    });
    
    if (result.canceled) return [];
    
    return result.assets.map((asset) => ({
      uri: asset.uri,
      name: asset.uri.split('/').pop(),
      type: getImageMimeType(asset.uri),
    }));
  } catch (error) {
    console.error('Error picking images:', error);
    Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصور');
    return [];
  }
};

/**
 * Get MIME type from image URI
 * @param {string} uri - Image URI
 * @returns {string}
 */
export const getImageMimeType = (uri) => {
  const extension = uri.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return mimeTypes[extension] || 'image/jpeg';
};

/**
 * Get farm image URL
 * @param {string} imageId - Image ID or URL
 * @returns {string}
 */
export const getFarmImageUrl = (imageId) => {
  if (!imageId) return 'https://via.placeholder.com/150';
  if (imageId.toString().startsWith('http')) return imageId;
  return `${API_URL}/api/images/${imageId}`;
};

/**
 * Get user profile image URL
 * @param {string} imagePath - Profile image path
 * @returns {string|null}
 */
export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
};

/**
 * Get platform-specific image URI
 * @param {string} uri - Original URI
 * @returns {string}
 */
export const getPlatformImageUri = (uri) => {
  if (Platform.OS === 'android') return uri;
  return uri.replace('file://', '');
};

/**
 * Create image object for FormData
 * @param {object} image - Image object with uri
 * @param {string} name - Optional custom name
 * @returns {object}
 */
export const createFormDataImage = (image, name = 'image.jpg') => {
  return {
    uri: getPlatformImageUri(image.uri),
    name: image.name || name,
    type: image.type || 'image/jpeg',
  };
};
