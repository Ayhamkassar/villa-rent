import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUser, updateUser } from '../services/profile.service';
import { User } from '../types/profile.types';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const loadUser = async () => {
    const id = await AsyncStorage.getItem('userId');
    const tk = await AsyncStorage.getItem('token');

    if (!id || !tk) {
      setLoading(false);
      return;
    }

    setUserId(id);
    setToken(tk);

    const res = await getUser(id, tk);
    setUser(res.data);
    setLoading(false);
  };

  const refresh = async () => {
    if (!userId || !token) return;

    setRefreshing(true);
    const res = await getUser(userId, token);
    setUser(res.data);
    setRefreshing(false);
  };

  const update = async (data: Partial<User>) => {
    if (!userId || !token) return;

    const res = await updateUser(userId, data, token);
    setUser(res.data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');

    setUser(null);
    setToken(null);
    setUserId(null);

    router.replace('./pages/LoginScreen');
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    refreshing,
    refresh,
    update,
    logout,
  };
};
