import api from './axiosInstance';
import ENDPOINTS from './endpoints';

export const fetchVariantOptions = () => api.get('/variant-options');

export const getVariantOption = (id) =>
  api.get(`/variant-options/${id}`);

export const createVariantOption = (data) =>
  api.post('/variant-options', data);

export const updateVariantOption = (id, data) =>
  api.put(`/variant-options/${id}`, data);

export const deleteVariantOption = (id) =>
  api.delete(`/variant-options/${id}`);
