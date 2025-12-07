import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/Footer";

// Lazy load all page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const DairyProduct = lazy(() => import("./pages/DairyProduct"));
const Fruits = lazy(() => import("./pages/Fruits"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AddToCart = lazy(() => import("./pages/AddToCart"));
const Profile = lazy(() => import("./pages/Profile"));



// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", marginTop: "5rem" }}>
    <div className="text-center">
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop/>
        <Navbar />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dairy" element={<DairyProduct />} />
            <Route path="/fruits" element={<Fruits />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<AddToCart />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      <Footer/>
      </Router>
    </CartProvider>
  );
}

export default App;
