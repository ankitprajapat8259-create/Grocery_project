import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // <-- Import Axios

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Optional: to show loading state
  const [error, setError] = useState(""); // Optional: to show error messages

  const navigate = useNavigate();

  const registerUser = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/register/",
      {
        username: name,   // <-- change here
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    alert("User Registered Successfully!");
    navigate("/login");
  } catch (err) {
    if (err.response) {
      setError(err.response.data?.message || JSON.stringify(err.response.data));
    } else if (err.request) {
      setError("No response from server. Check backend server.");
    } else {
      setError(err.message);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="text-center">Register</h2>

      <form onSubmit={registerUser}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
