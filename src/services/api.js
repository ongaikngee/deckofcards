const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  console.log("Calling.....");
  console.log('endpoint', endpoint)
  console.log('options', options)
  let token = localStorage.getItem("token");

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshToken = localStorage.getItem("refresh_token");

  const refreshResponse = await fetch(`${API_URL}/users/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!refreshResponse.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");

    window.location.href = "/login";

    throw new Error("Session expired");
  }

  const tokens = await refreshResponse.json();

  localStorage.setItem("token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);

  response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  return response;
};
