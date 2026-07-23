const BASE_URL = `/users`;
import { apiFetch } from "./api";

export const loginUser = async (username, password) => {
  const response = await apiFetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || "Login failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  await apiFetch(`${BASE_URL}/logout`, {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });
};

export const registerUser = async (username, password) => {
  const response = await apiFetch(`${BASE_URL}/`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || "Registration failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const updatePasswordAPI = async (
  user_id,
  currentPassword,
  newPassword,
) => {
  const response = await apiFetch(`${BASE_URL}/${user_id}/update-password`, {
    method: "PUT",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail || data?.message || "Password update failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const deleteUserAPI = async (user_id) => {
  const response = await apiFetch(`${BASE_URL}/${user_id}`, {
    method: "DELETE",
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail || data?.message || "User deletion failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const getCurrentUser = async () => {
  const response = await apiFetch(`${BASE_URL}/me`);
  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail || data?.message || "Failed to fetch current user";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await apiFetch(`${BASE_URL}/refresh/`, {
    method: "POST",
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to refresh");
  }

  return response.json();
};
