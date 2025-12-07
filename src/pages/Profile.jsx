import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user data from backend API
        const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          console.log("Profile API Response:", res.data);
          setUserData(res.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 404) {
          setError("Profile endpoint not found. Please check backend.");
        } else {
          setError("Failed to load profile. Please try again.");
          console.error("Profile fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", marginTop: "5rem" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="container mt-5" style={{ marginTop: "10rem" }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">👤 User Profile</h3>
            </div>
            <div className="card-body p-4">
              {userData && (
                <>
                  <div className="text-center mb-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: "100px", height: "100px", fontSize: "3rem" }}
                    >
                      {(() => {
                        // Try to get first letter from username, email, or name
                        const firstChar = 
                          userData.username?.charAt(0)?.toUpperCase() ||
                          userData.email?.charAt(0)?.toUpperCase() ||
                          userData.name?.charAt(0)?.toUpperCase() ||
                          "U";
                        return firstChar;
                      })()}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Username</label>
                    <div className="form-control bg-light">
                      {userData.username || "Not available"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Email</label>
                    <div className="form-control bg-light">
                      {userData.email || "Not available"}
                    </div>
                  </div>

                  {userData.user_id && (
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted">User ID</label>
                      <div className="form-control bg-light">
                        {userData.user_id}
                      </div>
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <button
                      className="btn btn-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/")}
                    >
                      Back to Home
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

