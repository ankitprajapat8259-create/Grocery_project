import api from './api';

export const productApi = {
  // Public endpoints
  getProducts: (params) => api.get('/products/', { params }),
  
  getProductById: (id) => api.get(`/products/${id}/`),
  
  searchProducts: (query) => api.get('/products/search/', { params: { search: query } }),
  
  // Admin endpoints
  createProduct: (productData) => {
    const formData = productData instanceof FormData ? productData : new FormData();
    if (!(productData instanceof FormData)) {
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
    }
    return api.post('/products/admin/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateProduct: (id, productData) => {
    const formData = productData instanceof FormData ? productData : new FormData();
    if (!(productData instanceof FormData)) {
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
    }
    return api.put(`/products/admin/${id}/update/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteProduct: (id) => api.delete(`/products/admin/${id}/delete/`),
};
