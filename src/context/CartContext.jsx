import React, { createContext, useState } from "react";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const clearCart = () => setCart([]);

  const [cart, setCart] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);

  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find(
        (i) => i.name === item.name && i.weight === item.weight
      );
      if (exist) {
        return prev.map((i) =>
          i.name === item.name && i.weight === item.weight
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (name, weight) => {
    setCart((prev) => prev.filter((i) => !(i.name === name && i.weight === weight)));
  };

  const updateQuantity = (name, weight, qty) => {
    setCart((prev) =>
      prev.map((i) =>
        i.name === name && i.weight === weight
          ? { ...i, quantity: qty < 1 ? 1 : qty }
          : i
      )
    );
  };

  const buyAll = () => {
    if (cart.length === 0) return;

    setInvoiceData({
      items: cart,
      subtotal: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      gstRate: 0.05,
      date: new Date().toLocaleString(),
    });
  };

  const closeInvoice = () => setInvoiceData(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        clearCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        buyAll,
        invoiceData,
        closeInvoice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
