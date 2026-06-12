import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { categoryApi } from "../services/categoryApi";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg grocery-navbar fixed-top">
      <div className="container-fluid">

        {/* Logo */}
        <Link className="navbar-brand fw-bold text-white" to="/">
          🥦 Grocery
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarToggler">

          {/* Left Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {categories.map((category) => (
              <li key={category.id} className="nav-item">
                <Link className="nav-link nav-g-link" to={`/category/${category.id}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Buttons */}
          <div className="d-flex align-items-center gap-2">

            {!isAuthenticated ? (
              <>
                <Link className="btn btn-outline-light" to="/login">Login</Link>
                <Link className="btn btn-outline-light" to="/register">Register</Link>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light" to="/profile">Profile</Link>
                <Link className="btn btn-outline-light" to="/my-orders">My Orders</Link>
                {isAdmin() && (
                  <Link className="btn btn-outline-light" to="/admin/dashboard">Admin</Link>
                )}
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </>
            )}

            <button className="btn cart-green-btn" onClick={() => navigate("/cart")}>
              🛒 My Cart ({cart.length})
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
