import api from './axiosInstance';
import ENDPOINTS from './endpoints';

export const fetchOrders = () => api.get(ENDPOINTS.ORDERS);

export const getOrder = (id) => api.get(`${ENDPOINTS.ORDERS}/${id}`);

export const createOrder = (data) => api.post(ENDPOINTS.ORDERS, data);

export const updateOrderStatus = (id, status) =>
  api.put(`${ENDPOINTS.ORDERS}/${id}/status`, { status }); // ✅ doğru format

export const deleteOrder = (id) => api.delete(`${ENDPOINTS.ORDERS}/${id}`);