import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { user, updatePassword } = useAuth();
  const handleUpdatePassword = async () => {
    setError(null);
    if (
      currentPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("New Password is not matching...");
      return;
    }

    if (currentPassword.trim() === newPassword.trim()) {
      setError("New Password cannot be the same as current password.");
      return;
    }

    try {
      await updatePassword(user, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update password.");
    }
  };
  return (
    <div className="container">
      <div className="h2">Update Password</div>
      <form>
        <div className="mb-3">
          <label htmlFor="inputCurrentPassword" className="form-label">
            Current Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="inputCurrentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="inputNewPassword" className="form-label">
            New Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="inputNewPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="inputConfirmPassword" className="form-label">
            Confirm Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="inputConfirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleUpdatePassword()}
        >
          Update Password
        </button>
      </form>
      {error && <div className="mt-5 alert alert-danger">{error}</div>}
      {success && <div className="mt-5 alert alert-success">{success}</div>}
    </div>
  );
};

export default UpdatePassword;
