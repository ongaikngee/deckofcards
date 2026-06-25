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
