import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/authApi";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setEditData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        mobile_number: user.mobile_number || "",
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    if (user) {
      setEditData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        mobile_number: user.mobile_number || "",
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError("");

    try {
      const updateData = {
        first_name: editData.first_name,
        last_name: editData.last_name,
        mobile_number: editData.mobile_number,
        email: user.email,
      };
      const response = await authApi.updateProfile(updateData);
      setUser(response.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.detail || err.response?.data?.error || JSON.stringify(err.response?.data) || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(true);
    setError("");

    try {
      await authApi.deleteAccount();
      logout();
      navigate("/login");
      alert("Account deleted successfully!");
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError(err.response?.data?.error || "Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
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

  if (!user) {
    return (
      <div className="container mt-5" style={{ marginTop: "10rem" }}>
        <div className="alert alert-danger" role="alert">
          Please login to view your profile.
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
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.first_name}
                      onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.last_name}
                      onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.mobile_number}
                      onChange={(e) => setEditData({ ...editData, mobile_number: e.target.value })}
                    />
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={updateLoading}
                    >
                      {updateLoading ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: "100px", height: "100px", fontSize: "3rem" }}
                    >
                      {(() => {
                        const firstChar =
                          user.first_name?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          "U";
                        return firstChar;
                      })()}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">First Name</label>
                    <div className="form-control bg-light">
                      {user.first_name || "Not available"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Last Name</label>
                    <div className="form-control bg-light">
                      {user.last_name || "Not available"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Email</label>
                    <div className="form-control bg-light">
                      {user.email || "Not available"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Role</label>
                    <div className="form-control bg-light">
                      {user.role || "Not available"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted">Mobile Number</label>
                    <div className="form-control bg-light">
                      {user.mobile_number || "Not available"}
                    </div>
                  </div>

                  {user.id && (
                    <div className="mb-3">
                      <label className="form-label fw-bold text-muted">User ID</label>
                      <div className="form-control bg-light">
                        {user.id}
                      </div>
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Delete Account"}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
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

