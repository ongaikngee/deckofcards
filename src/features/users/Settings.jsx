import React, { useState } from "react";
import UpdatePassword from "./UpdatePassword";
import Chips from "./Chips";

import Modal from "../../components/Modal";
import { GearIcon } from "@phosphor-icons/react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, logout, deleteUser } = useAuth();

  const navigate = useNavigate();
  const formLogout = () => {
    logout();
    navigate("/login");
  };

  const deleteUserForm = async () => {
    await deleteUser(user.id);
    formLogout();
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
              className="btn btn-danger"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#deleteUserModal"
            >
              Delete User
            </button>
            <Modal
              modalID="deleteUserModal"
              modalTitle="Delete Account"
              modalInstruction={
                <div>
                  Deleting your account is irreversible. Are you sure you want
                  to proceed?
                </div>
              }
              closeBtnLabel="Cancel"
              okBtnLabel="Delete Account"
              okBtnFunc={deleteUserForm}
              okBtnClass="btn-danger"
            />
          </div>
        </form>
      </div>
      <UpdatePassword />
    </div>
  );
};

export default Settings;
