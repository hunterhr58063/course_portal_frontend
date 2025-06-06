import axios from 'axios';

const api = axios.create({
  baseURL: 'https://course-portal-backend.onrender.com/api', // or your backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
