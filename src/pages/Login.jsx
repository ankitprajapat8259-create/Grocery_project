import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      // API Response - Debugging
      console.log("=== LOGIN RESPONSE DEBUG ===");
      console.log("Full Response Object:", res);
      console.log("Response Data:", res.data);
      console.log("Response Status:", res.status);
      console.log("All Response Keys:", Object.keys(res.data || {}));
      
      // Token Save in localStorage - Django REST Framework format
      // Response has 'access' and 'refresh' tokens
      const accessToken = res.data?.access || 
                          res.data?.accessToken || 
                          res.data?.access_token || 
                          res.data?.token || 
                          res.data?.authToken ||
                          res.data?.data?.access ||
                          res.data?.data?.accessToken ||
                          res.data?.data?.token;

      if (accessToken) {
        // Save access token (main token for API calls)
        localStorage.setItem("token", accessToken);
        
        // Optionally save refresh token for token refresh functionality
        if (res.data?.refresh) {
          localStorage.setItem("refreshToken", res.data.refresh);
        }
        
        // Redirect to Profile
        navigate("/");
      } else {
        setError("Token not found in response. Check console for details.");
        console.error("❌ TOKEN NOT FOUND - Full response structure:");
        console.error(JSON.stringify(res.data, null, 2));
      }
    } catch (err) {
      if (err.response) {
        // Server responded with error status
        console.error("Error Response:", err.response.data);
        setError(err.response.data?.message || err.response.data?.error || "Invalid Credentials!");
      } else if (err.request) {
        // Request was made but no response received
        console.error("No Response:", err.request);
        setError("No response from server. Please check if backend is running.");
      } else {
        // Something else happened
        console.error("Error:", err.message);
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control py-2"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control py-2"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold">
            Login
          </button>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
