import api from './axiosInstance';
import ENDPOINTS from './endpoints';

export const fetchProducts = () => api.get(ENDPOINTS.PRODUCTS);

export const getProduct = (id) =>
  api.get(`${ENDPOINTS.PRODUCTS}/${id}`);

export const createProduct = (data) =>
  api.post(ENDPOINTS.PRODUCTS, data);

export const updateProduct = (id, data) =>
  api.put(`${ENDPOINTS.PRODUCTS}/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`${ENDPOINTS.PRODUCTS}/${id}`);
