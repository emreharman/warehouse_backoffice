import api from './axiosInstance';
import ENDPOINTS from './endpoints';

export const fetchCategories = () => api.get(ENDPOINTS.CATEGORIES);

export const getCategory = (id) =>
  api.get(`${ENDPOINTS.CATEGORIES}/${id}`);

export const createCategory = (data) =>
  api.post(ENDPOINTS.CATEGORIES, data);

export const updateCategory = (id, data) =>
  api.put(`${ENDPOINTS.CATEGORIES}/${id}`, data);

export const deleteCategory = (id) =>
  api.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
