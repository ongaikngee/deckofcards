const API_URL = import.meta.env.VITE_API_URL;

export const getUsersChipCounts = async () => {
  const response = await fetch(`${API_URL}/users/chip-counts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || "Failed to load users chip counts";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const makeAdmin = async (user_id) => {
  const response = await fetch(`${API_URL}/users/${user_id}/make-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || "Failed to promote user";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const deleteUser = async (user_id) => {
  const response = await fetch(`${API_URL}/users/${user_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || "User deletion failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};
