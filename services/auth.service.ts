import { API_URL } from '@/server/config';
import axios from 'axios';

export const loginRequest = async (email: string, password: string) => {
  const res = await axios.post(`${API_URL}/api/login`, {
    email,
    password,
  });

  return res.data;
};

export const registerRequest = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await axios.post(`${API_URL}/api/register`, {
    name,
    email,
    password,
  });

  return res.data;
};
