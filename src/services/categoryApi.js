import api from './api';

export const categoryApi = {
  // Public endpoints
  getCategories: () => {
    console.log("Fetching categories from /categories/");
    return api.get('/categories/');
  },
  
  getCategoryById: (id) => api.get(`/categories/${id}/`),
  
  // Admin endpoints
  createCategory: (categoryData) => api.post('/categories/admin/create/', categoryData),
  
  updateCategory: (id, categoryData) => api.put(`/categories/admin/${id}/update/`, categoryData),
  
  deleteCategory: (id) => api.delete(`/categories/admin/${id}/delete/`),
};
