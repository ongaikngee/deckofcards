import React from "react";
import { GearIcon } from "@phosphor-icons/react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const formLogout = () => {
    logout()
    navigate("/login")
    
  }
  return (
    <div>
      <h2>
        <GearIcon size={44} />
        Settings
      </h2>
      <div className="container m-3">
        <form>
          <button className="btn btn-primary" type="button" onClick={()=>formLogout()}>Log out</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
