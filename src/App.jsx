import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DairyProduct from "./pages/DairyProduct";
import Fruits from "./pages/Fruits";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AddToCart from "./pages/AddToCart";
import Profile from "./pages/Profile";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/Footer";



function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop/>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dairy" element={<DairyProduct />} />
          <Route path="/fruits" element={<Fruits />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<AddToCart />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      <Footer/>
      </Router>
    </CartProvider>
  );
}

export default App;
