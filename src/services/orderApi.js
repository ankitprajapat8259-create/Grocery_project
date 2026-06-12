import api from './api';

export const orderApi = {
  // User endpoints
  createOrder: () => api.post('/orders/create/'),
  
  getOrders: () => api.get('/orders/'),
  
  getOrderById: (id) => api.get(`/orders/${id}/`),
  
  // Admin endpoints
  getAllOrders: () => api.get('/orders/admin/all/'),
  
  updateOrderStatus: (id, statusData) => api.patch(`/orders/admin/${id}/status/`, statusData),
};
