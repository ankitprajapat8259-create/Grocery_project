import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="g-footer pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          {/* Brand / About */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-white">🥦 Grocery</h4>
            <p className="footer-text">
              Your one-stop solution for fresh vegetables, fruits & dairy products. 
              We deliver freshness to your doorstep with quality assurance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold footer-heading">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Vegetables</Link></li>
              <li><Link to="/fruits">Fruits</Link></li>
              <li><Link to="/dairy">Dairy Products</Link></li>
              
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold footer-heading">Contact</h6>
            <p className="footer-text">Email: support@grocery.com</p>
            <p className="footer-text">Phone: +91 12345 67890</p>
            <p className="footer-text">Address: 123 Vijay nagar Sabji Mandi, Indore, India</p>
          </div>

          {/* Social Icons */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold footer-heading">Follow Us</h6>
            <div className="d-flex gap-3 fs-4">
              <a href="#" className="footer-icon"><i className="bi bi-facebook">facebook</i></a>
              <a href="#" className="footer-icon"><i className="bi bi-instagram">instagram</i></a>
              <a href="#" className="footer-icon"><i className="bi bi-twitter">twitter</i></a>
            </div>
          </div>

        </div>

        <hr className="footer-line" />

        <div className="text-center text-white">
          &copy; {new Date().getFullYear()} 🥦 Grocery. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
