import api from './api';

export const cartApi = {
  getCart: () => api.get('/cart/'),
  
  addToCart: (cartData) => api.post('/cart/add/', {
    product_id: cartData.product || cartData.product_id || cartData.id,
    quantity: cartData.quantity,
    weight: cartData.weight || '1kg',
  }),
  
  updateCartItem: (id, cartData) => api.patch(`/cart/update/${id}/`, cartData),
  
  removeFromCart: (id) => {
    console.log("Removing from cart with ID:", id);
    return api.delete(`/cart/remove/${id}/`);
  },
  
  clearCart: () => api.delete('/cart/clear/'),
};
