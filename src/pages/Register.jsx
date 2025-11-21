import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // <-- IMPORTANT

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();  // <-- HOOK FOR REDIRECT

  const registerUser = (e) => {
    e.preventDefault();

    const userData = { name, email, password };
    localStorage.setItem("user", JSON.stringify(userData));

    alert("User Registered Successfully!");

    navigate("/login");  // <-- Redirect to Login Page
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="text-center">Register</h2>

      <form onSubmit={registerUser}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-success w-100">Register</button>
      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
      </form>

    </div>
  );
};

export default Register;
