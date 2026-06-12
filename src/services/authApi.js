import api from './api';

export const authApi = {
  register: (userData) => api.post('/auth/register/', userData),

  login: (credentials) => api.post('/auth/login/', credentials),

  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),

  getProfile: () => api.get('/auth/'),

  updateProfile: (userData) => api.put('/auth/', userData),

  deleteAccount: () => api.delete('/auth/'),

  resetPassword: (data) => api.post('/auth/reset-password/', data),
};
