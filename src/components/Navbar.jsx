import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
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

            <li className="nav-item">
              <Link className="nav-link nav-g-link" to="/">Vegetable</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-g-link" to="/dairy">Dairy Product</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link nav-g-link" to="/fruits">Fruits</Link>
            </li>

          </ul>

          {/* Right Buttons */}
          <div className="d-flex align-items-center gap-2">

            {!localStorage.getItem("token") ? (
              <>
                <Link className="btn btn-outline-light" to="/login">Login</Link>
                <Link className="btn btn-outline-light" to="/register">Register</Link>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light" to="/profile">Profile</Link>
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
