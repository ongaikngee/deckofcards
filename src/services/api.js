import { JWT_TOKEN } from "../constants/auth";
import { AUTH_ERROR } from "../constants/errors";
const API_URL = import.meta.env.VITE_API_URL;

let refreshPromise = null;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem(JWT_TOKEN.ACCESS_TOKEN);

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

  if (errorData.detail?.error !== AUTH_ERROR.TOKEN_EXPIRED) {
    return response;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem(JWT_TOKEN.REFRESH_TOKEN);

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
        localStorage.removeItem(JWT_TOKEN.ACCESS_TOKEN);
        localStorage.removeItem(JWT_TOKEN.REFRESH_TOKEN);

        window.location.href = "/login";

        throw new Error("Session expired");
      }

      const tokens = await refreshResponse.json();

      localStorage.setItem(JWT_TOKEN.ACCESS_TOKEN, tokens.access_token);
      localStorage.setItem(JWT_TOKEN.REFRESH_TOKEN, tokens.refresh_token);

      return tokens;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  await refreshPromise;
  const newToken = localStorage.getItem(JWT_TOKEN.ACCESS_TOKEN);

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
