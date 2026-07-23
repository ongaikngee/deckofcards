const BASE_URL = `/users`;
import { apiFetch } from "./api";

export const getUsersChipCounts = async () => {
  const response = await apiFetch(`${BASE_URL}/chip-counts`);

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail || data?.message || "Failed to load users chip counts";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const makeAdmin = async (user_id) => {
  const response = await apiFetch(
    `${BASE_URL}/${user_id}/make-admin`,
    {
      method: "POST"
    },
  );

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail || data?.message || "Failed to promote user";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const deleteUser = async (user_id) => {
  const response = await apiFetch(
    `${BASE_URL}/${user_id}`,
    {
      method: "DELETE"
    },
  );

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
