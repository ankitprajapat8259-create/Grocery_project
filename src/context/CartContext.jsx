import React, { createContext, useState, useEffect } from "react";
import { cartApi } from "../services/cartApi";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  // Fetch cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await cartApi.getCart();
      const cartData = response.data || [];
      
      // Transform backend cart data to match frontend structure
      const transformedCart = cartData.map(item => {
        const basePrice = item.product?.price || item.price || 0;
        const weight = item.weight || '1kg';
        
        // Calculate unit price based on weight
        const weightMultiplier = {
          '250g': 0.25,
          '500g': 0.5,
          '1kg': 1,
          '2kg': 2
        }[weight] || 1;
        
        const adjustedPrice = basePrice * weightMultiplier;
        
        return {
          id: item.id,
          cart_id: item.id,
          name: item.product?.name || item.name,
          image: item.product?.image || item.image,
          img: item.product?.image || item.img,
          price: adjustedPrice,
          product_price: basePrice,
          basePrice: basePrice,
          weight: weight,
          quantity: item.quantity,
          product_id: item.product?.id || item.product_id,
        };
      });
      
      setCart(transformedCart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart");
      // Keep local cart if API fails
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    console.log("Adding to cart:", item);
    console.log("Is authenticated:", isAuthenticated);
    
    if (!isAuthenticated) {
      // Add to local cart if not authenticated
      setCart((prev) => {
        const exist = prev.find(
          (i) => i.product_id === item.id && i.weight === item.weight
        );
        if (exist) {
          return prev.map((i) =>
            i.product_id === item.id && i.weight === item.weight
              ? { ...i, quantity: (i.quantity || 0) + 1 }
              : i
          );
        }
        return [...prev, { ...item, product_id: item.id, quantity: 1 }];
      });
      console.log("Added to local cart");
      return;
    }

    // Add to backend cart if authenticated
    try {
      console.log("Adding to backend cart with product ID:", item.id, "weight:", item.weight);
      const response = await cartApi.addToCart({
        product: item.id,
        quantity: 1,
        weight: item.weight || '1kg',
      });
      console.log("Backend response:", response);
      await fetchCart(); // Refresh cart from backend
      console.log("Successfully added to backend cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      console.error("Error response data:", err.response?.data);
      console.error("Error response status:", err.response?.status);
      const errorMessage = err.response?.data?.error || err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to add item to cart";
      alert(errorMessage);
      setError(errorMessage);
    }
  };

  const removeFromCart = async (cartItemId) => {
    console.log("Removing from cart with ID:", cartItemId);
    console.log("Is authenticated:", isAuthenticated);
    
    if (!isAuthenticated) {
      // Remove from local cart
      setCart((prev) => prev.filter((i) => i.id !== cartItemId));
      console.log("Removed from local cart");
      return;
    }

    // Remove from backend cart
    try {
      await cartApi.removeFromCart(cartItemId);
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      console.error("Error response:", err.response);
      
      // If item doesn't exist (404), just remove from local cart without error
      if (err.response?.status === 404) {
        console.log("Item not found in backend cart, removing from local cart only");
        setCart((prev) => prev.filter((i) => i.cart_id !== cartItemId && i.id !== cartItemId));
        return;
      }
      
      // For other errors, remove from local cart and show error
      setCart((prev) => prev.filter((i) => i.cart_id !== cartItemId && i.id !== cartItemId));
      setError("Failed to remove item from backend cart, removed from local cart");
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    if (!isAuthenticated) {
      // Update local cart
      setCart((prev) =>
        prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity } : i
        )
      );
      return;
    }

    // Update backend cart
    try {
      await cartApi.updateCartItem(cartItemId, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
      setError("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    // Clear backend cart using the clear endpoint
    try {
      await cartApi.clearCart();
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      // Even if backend clear fails, clear local cart
      setCart([]);
    }
  };

  const buyAll = () => {
    if (cart.length === 0) return;

    setInvoiceData({
      items: cart,
      subtotal: cart.reduce((s, i) => s + (i.price || i.product_price) * i.quantity, 0),
      gstRate: 0.05,
      date: new Date().toLocaleString(),
    });
  };

  const closeInvoice = () => setInvoiceData(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        clearCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        buyAll,
        invoiceData,
        closeInvoice,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
