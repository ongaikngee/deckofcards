import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  registerUser,
  updatePasswordAPI,
  deleteUserAPI,
  getCurrentUser,
} from "../../services/authApi";
import { JWT_TOKEN, USER_ROLE } from "../../constants/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(USER_ROLE.USER);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem(JWT_TOKEN.ACCESS_TOKEN);
    localStorage.removeItem(JWT_TOKEN.REFRESH_TOKEN);

    setUser(null);
    setRole(USER_ROLE.USER);
  };

  const setSession = (response) => {
    localStorage.setItem(JWT_TOKEN.ACCESS_TOKEN, response.access_token);
    localStorage.setItem(JWT_TOKEN.REFRESH_TOKEN, response.refresh_token);

    setUser(response.user);
    setRole(response.user.role);
  };

  useEffect(() => {
    const token = localStorage.getItem(JWT_TOKEN.ACCESS_TOKEN);

    if (!token) {
      setLoading(false);
      return;
    }

    async function restoreUser() {
      try {
        const user = await getCurrentUser();

        setUser(user);
        setRole(user.role);
      } catch (error) {
        console.error("Failed to restore user:", error);
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    restoreUser();
  }, []);

  const login = async (id, password) => {
    const response = await loginUser(id, password);
    setSession(response);
    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearSession();
    }
  };

  const register = async (id, password) => {
    const response = await registerUser(id, password);
    setSession(response);
    return response;
  };

  const updatePassword = async (user_id, currentPW, newPW) => {
    const response = await updatePasswordAPI(user_id, currentPW, newPW);
    return response;
  };

  const deleteUser = async (user_id) => {
    const response = await deleteUserAPI(user_id);
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        logout,
        register,
        updatePassword,
        deleteUser,
        isAuthenticated: !!user,
        isAdmin: role === USER_ROLE.ADMIN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
