/**
 * useFarms Hook
 * Custom hook for farm data management
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as farmService from '../services/farmService';

/**
 * Hook for managing farms list
 * @param {object} initialFilters - Initial filter values
 * @returns {object} Farms state and methods
 */
export const useFarms = (initialFilters = {}) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState(initialFilters.type || 'all');
  const [search, setSearch] = useState(initialFilters.search || '');

  /**
   * Fetch farms with current filters
   */
  const fetchFarms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await farmService.getFarms({ type: filter, search });
      setFarms(data);
    } catch (error) {
      console.error('Error fetching farms:', error);
      Alert.alert('خطأ', 'فشل في تحميل المزارع');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, search]);

  /**
   * Refresh farms list
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFarms();
  }, [fetchFarms]);

  /**
   * Update filter and fetch farms
   * @param {string} newFilter - New filter value
   */
  const updateFilter = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  /**
   * Update search query
   * @param {string} query - Search query
   */
  const updateSearch = useCallback((query) => {
    setSearch(query);
  }, []);

  return {
    farms,
    loading,
    refreshing,
    filter,
    search,
    fetchFarms,
    onRefresh,
    updateFilter,
    updateSearch,
    setSearch,
  };
};

/**
 * Hook for managing single farm details
 * @param {string} farmId - Farm ID
 * @returns {object} Farm state and methods
 */
export const useFarmDetails = (farmId) => {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch farm details
   */
  const fetchFarm = useCallback(async () => {
    if (!farmId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await farmService.getFarmById(farmId);
      setFarm(data);
    } catch (err) {
      const message = err.message || 'خطأ في جلب بيانات المزرعة';
      setError(message);
      Alert.alert('خطأ', message);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  return {
    farm,
    loading,
    error,
    fetchFarm,
    setFarm,
  };
};

/**
 * Hook for managing user's own farms
 * @param {string} ownerId - Owner user ID
 * @returns {object} Farms state and methods
 */
export const useMyFarms = (ownerId) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch user's farms
   */
  const fetchMyFarms = useCallback(async () => {
    if (!ownerId) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await farmService.getFarmsByOwner(ownerId);
      setFarms(data);
    } catch (error) {
      console.error('Error fetching my farms:', error);
      Alert.alert('خطأ', 'فشل في تحميل المزارع');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ownerId]);

  /**
   * Refresh farms list
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyFarms();
  }, [fetchMyFarms]);

  return {
    farms,
    loading,
    refreshing,
    fetchMyFarms,
    onRefresh,
  };
};

export default useFarms;
