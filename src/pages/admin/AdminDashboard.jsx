import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/adminApi";
import { productApi } from "../../services/productApi";
import { categoryApi } from "../../services/categoryApi";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch products count
      const productsRes = await productApi.getProducts();
      const productsCount = productsRes.data?.length || 0;

      // Fetch categories count
      const categoriesRes = await categoryApi.getCategories();
      const categoriesCount = categoriesRes.data?.length || 0;

      // Fetch dashboard stats from admin API
      const dashboardRes = await adminApi.getDashboardStats();
      
      setStats({
        totalProducts: productsCount,
        totalCategories: categoriesCount,
        totalOrders: dashboardRes.data?.total_orders || 0,
        totalUsers: dashboardRes.data?.total_users || 0,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", marginTop: "5rem" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <p className="text-muted">Welcome, {user?.first_name || user?.email}</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <h2 className="text-primary">{stats.totalProducts}</h2>
              <button 
                className="btn btn-primary btn-sm mt-2"
                onClick={() => navigate("/admin/products")}
              >
                Manage Products
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Categories</h5>
              <h2 className="text-success">{stats.totalCategories}</h2>
              <button 
                className="btn btn-success btn-sm mt-2"
                onClick={() => navigate("/admin/categories")}
              >
                Manage Categories
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <h2 className="text-warning">{stats.totalOrders}</h2>
              <button 
                className="btn btn-warning btn-sm mt-2"
                onClick={() => navigate("/admin/orders")}
              >
                Manage Orders
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h2 className="text-info">{stats.totalUsers}</h2>
              <button 
                className="btn btn-info btn-sm mt-2"
                onClick={() => navigate("/admin/users")}
              >
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Quick Actions</h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/products/create")}
                >
                  Add New Product
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => navigate("/admin/categories/create")}
                >
                  Add New Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
