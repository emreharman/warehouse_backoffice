import api from './axiosInstance';
import ENDPOINTS from './endpoints';

export const fetchVariantOptions = () => api.get(ENDPOINTS.VARIANT_OPTIONS);

export const createVariantOption = (data) =>
  api.post(ENDPOINTS.VARIANT_OPTIONS, data);

export const updateVariantOption = (id, data) =>
  api.put(`${ENDPOINTS.VARIANT_OPTIONS}/${id}`, data);

export const deleteVariantOption = (id) =>
  api.delete(`${ENDPOINTS.VARIANT_OPTIONS}/${id}`);
