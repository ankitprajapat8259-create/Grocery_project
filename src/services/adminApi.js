import api from './api';

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard/'),
  
  getAllUsers: () => api.get('/admin/users/'),
  
  toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/toggle-status/`),
  
  // Category management (using categoryApi)
  // Product management (using productApi)
  // Order management (using orderApi)
};
