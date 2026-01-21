/**
 * useUser Hook
 * Custom hook for user profile management
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as userService from '../services/userService';
import * as authService from '../services/authService';
import { pickSingleImage } from '../utils/imageHelpers';

/**
 * Hook for managing current user profile
 * @returns {object} User state and methods
 */
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  /**
   * Initialize user data from storage
   */
  const initUser = useCallback(async () => {
    try {
      const authData = await authService.checkAuth();
      if (authData.userId && authData.token) {
        setUserId(authData.userId);
        setToken(authData.token);
        await fetchUser(authData.userId);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user data by ID
   * @param {string} id - User ID
   */
  const fetchUser = useCallback(async (id) => {
    try {
      const data = await userService.getUserById(id || userId);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('خطأ', 'فشل في جلب بيانات المستخدم');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  /**
   * Refresh user data
   */
  const onRefresh = useCallback(() => {
    if (userId) {
      setRefreshing(true);
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  /**
   * Update user name
   * @param {string} name - New name
   * @returns {Promise<boolean>}
   */
  const updateName = useCallback(async (name) => {
    if (!name?.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم صالح');
      return false;
    }
    
    try {
      await userService.updateUserName(userId, name);
      setUser((prev) => ({ ...prev, name: name.trim() }));
      Alert.alert('نجح', 'تم تحديث الاسم بنجاح');
      return true;
    } catch (error) {
      Alert.alert('خطأ', error.message || 'فشل تحديث الاسم');
      return false;
    }
  }, [userId]);

  /**
   * Update user email
   * @param {string} email - New email
   * @returns {Promise<boolean>}
   */
  const updateEmail = useCallback(async (email) => {
    if (!email?.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال إيميل صالح');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('تنبيه', 'يرجى إدخال إيميل صالح');
      return false;
    }
    
    try {
      await userService.updateUserEmail(userId, email);
      setUser((prev) => ({ ...prev, email: email.trim() }));
      Alert.alert('نجح', 'تم تحديث الإيميل بنجاح');
      return true;
    } catch (error) {
      Alert.alert('خطأ', error.message || 'فشل تحديث الإيميل');
      return false;
    }
  }, [userId]);

  /**
   * Pick and upload profile image
   * @returns {Promise<boolean>}
   */
  const uploadProfileImage = useCallback(async () => {
    try {
      const image = await pickSingleImage();
      if (!image) return false;
      
      await userService.uploadProfileImage(userId, image);
      await fetchUser(userId);
      return true;
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('خطأ', 'فشل في رفع الصورة');
      return false;
    }
  }, [userId, fetchUser]);

  return {
    user,
    loading,
    refreshing,
    userId,
    token,
    initUser,
    fetchUser,
    onRefresh,
    updateName,
    updateEmail,
    uploadProfileImage,
    setUser,
  };
};

/**
 * Hook for managing users list (admin)
 * @returns {object} Users state and methods
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch all users
   */
  const fetchUsers = useCallback(async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('خطأ', 'فشل في جلب قائمة المستخدمين');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Refresh users list
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Delete a user
   * @param {string} userId - User ID to delete
   * @returns {Promise<boolean>}
   */
  const deleteUser = useCallback(async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      Alert.alert('نجح', 'تم حذف المستخدم');
      return true;
    } catch (error) {
      Alert.alert('خطأ', error.message || 'فشل حذف المستخدم');
      return false;
    }
  }, []);

  return {
    users,
    loading,
    refreshing,
    fetchUsers,
    onRefresh,
    deleteUser,
  };
};

export default useUser;
