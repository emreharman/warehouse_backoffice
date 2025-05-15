import axios from 'axios';
import ENDPOINTS from './endpoints';

const instance = axios.create({
  baseURL: ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token'ı her isteğe ekle
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Hata yönetimi
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Buraya alert, toast, log vs. eklenebilir
    return Promise.reject(error);
  }
);

export default instance;
