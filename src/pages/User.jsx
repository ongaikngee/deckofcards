import React from "react";
import UserNavBar from "../components/UserNavBar";
import { Outlet } from "react-router-dom";

const User = () => {
  return (
    <div className="row">
      <UserNavBar />

      <div className="row my-4">
        <Outlet />
      </div>
    </div>
  );
};

export default User;
