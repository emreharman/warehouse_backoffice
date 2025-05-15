import api from './axiosInstance';
import ENDPOINTS from './endpoints';

export const loginRequest = (credentials) => {
  return api.post(ENDPOINTS.LOGIN, credentials);
};
