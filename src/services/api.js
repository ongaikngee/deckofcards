const API_URL = import.meta.env.VITE_API_URL;
let refreshPromise = null;

export const apiFetch = async (endpoint, options = {}) => {
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

  let errorData = {};

  try {
    errorData = await response.clone().json();
  } catch {
    // Response wasn't JSON; leave errorData as an empty object.
  }

  if (errorData.detail?.error !== "token_expired") {
    return response;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
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

      return tokens;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  await refreshPromise;
  const newToken = localStorage.getItem("token");

  response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    },
  });

  return response;
};
