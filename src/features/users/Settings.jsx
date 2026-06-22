import React, { useState } from "react";
import UpdatePassword from "./UpdatePassword";
import Chips from "./Chips";
import { GearIcon } from "@phosphor-icons/react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const { logout } = useAuth();

  const navigate = useNavigate();
  const formLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
      <h2>
        <GearIcon size={44} />
        Settings
      </h2>
      <div className="container m-3">
        <form>
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => formLogout()}
            >
              Log out
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setShowUpdatePassword(!showUpdatePassword)}
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
      {showUpdatePassword && <UpdatePassword />}
    </div>
  );
};

export default Settings;
