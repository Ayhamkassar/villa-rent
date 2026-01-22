import { API_URL } from '@/server/config';
import axios from 'axios';


export const getUser = (id: string, token: string) => {
return axios.get(`${API_URL}/api/users/${id}`, {
headers: { Authorization: `Bearer ${token}` },
});
};


export const updateUser = (
id: string,
data: Partial<{ name: string; email: string }>,
token: string
) => {
return axios.put(`${API_URL}/api/users/${id}`, data, {
headers: { Authorization: `Bearer ${token}` },
});
};