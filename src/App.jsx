import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { UserRoute, AdminRoute } from "./components/ProtectedRoute";
import Footer from "./components/Footer";

// Lazy load all page components for code splitting
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const AddToCart = lazy(() => import("./pages/AddToCart"));
const Profile = lazy(() => import("./pages/Profile"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const MyOrderDetail = lazy(() => import("./pages/MyOrderDetail"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ProductList = lazy(() => import("./pages/admin/ProductList"));
const ProductManagement = lazy(() => import("./pages/admin/ProductManagement"));
const CategoryList = lazy(() => import("./pages/admin/CategoryList"));
const CategoryManagement = lazy(() => import("./pages/admin/CategoryManagement"));
const OrderList = lazy(() => import("./pages/admin/OrderList"));
const OrderDetail = lazy(() => import("./pages/admin/OrderDetail"));
const UserList = lazy(() => import("./pages/admin/UserList"));



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
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop/>
          <Navbar />
          
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<CategoryPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/cart" element={<AddToCart />} />
              <Route 
                path="/profile" 
                element={
                  <UserRoute>
                    <Profile />
                  </UserRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <UserRoute>
                    <MyOrders />
                  </UserRoute>
                } 
              />
              <Route 
                path="/my-orders/:orderId" 
                element={
                  <UserRoute>
                    <MyOrderDetail />
                  </UserRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <AdminRoute>
                    <ProductList />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/products/create" 
                element={
                  <AdminRoute>
                    <ProductManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/products/:id/edit" 
                element={
                  <AdminRoute>
                    <ProductManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/categories" 
                element={
                  <AdminRoute>
                    <CategoryList />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/categories/create" 
                element={
                  <AdminRoute>
                    <CategoryManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/categories/:id/edit" 
                element={
                  <AdminRoute>
                    <CategoryManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <AdminRoute>
                    <OrderList />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/orders/:orderId" 
                element={
                  <AdminRoute>
                    <OrderDetail />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <AdminRoute>
                    <UserList />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Suspense>
        <Footer/>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
