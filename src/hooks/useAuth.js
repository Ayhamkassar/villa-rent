/**
 * useAuth Hook
 * Custom hook for authentication state management
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as authService from '../services/authService';
import { ROUTES } from '../config';

/**
 * Hook for managing authentication state
 * @returns {object} Auth state and methods
 */
export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check current authentication status
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const authData = await authService.checkAuth();
      setIsAuthenticated(authData.isAuthenticated);
      setIsAdmin(authData.isAdmin);
      setUserId(authData.userId);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>}
   */
  const login = useCallback(async (email, password) => {
    try {
      const { user } = await authService.login(email, password);
      setIsAuthenticated(true);
      setIsAdmin(user.isAdmin || false);
      setUserId(user.id);
      return true;
    } catch (error) {
      Alert.alert(
        'خطأ',
        error.message || 'فشل تسجيل الدخول، تحقق من البريد وكلمة المرور.'
      );
      return false;
    }
  }, []);

  /**
   * Register new user
   * @param {object} userData - Registration data
   * @returns {Promise<boolean>}
   */
  const register = useCallback(async (userData) => {
    try {
      await authService.register(userData);
      Alert.alert('تم', 'تم إنشاء الحساب بنجاح');
      return true;
    } catch (error) {
      Alert.alert(
        'خطأ',
        error.message || 'حدث خطأ أثناء إنشاء الحساب'
      );
      return false;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              setIsAuthenticated(false);
              setIsAdmin(false);
              setUserId(null);
              router.replace(ROUTES.LOGIN);
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  }, [router]);

  /**
   * Navigate to appropriate home screen based on role
   */
  const navigateToHome = useCallback(() => {
    if (isAdmin) {
      router.replace(ROUTES.ADMIN_ADD_VILLA);
    } else {
      router.replace(ROUTES.FARM_LIST);
    }
  }, [isAdmin, router]);

  /**
   * Require authentication - redirect to login if not authenticated
   * @returns {boolean}
   */
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      Alert.alert('تنبيه', 'يرجى تسجيل الدخول');
      router.replace(ROUTES.LOGIN);
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  return {
    isLoading,
    isAuthenticated,
    isAdmin,
    userId,
    login,
    register,
    logout,
    checkAuthStatus,
    navigateToHome,
    requireAuth,
  };
};

export default useAuth;
