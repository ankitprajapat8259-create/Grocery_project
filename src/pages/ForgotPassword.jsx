import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.resetPassword({ email, new_password: newPassword });
      setSuccess(true);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Failed to reset password:", err);
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-5 mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="text-center">Reset Password</h2>

      {success ? (
        <div className="alert alert-success" role="alert">
          Password reset successfully! <Link to="/login">Login</Link> with your new password.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-danger">{error}</p>}

          <button className="btn btn-success w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center mt-3">
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
