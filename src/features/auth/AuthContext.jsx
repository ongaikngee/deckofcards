import { createContext, useContext, useState } from "react";
import { loginUser, registerUser, updatePasswordAPI, deleteUserAPI } from "../../services/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (id, password) => {
    const response = await loginUser(id, password);

    setUser(response?.user_id ?? id);
    return response;
  };

  function logout() {
    setUser(null);
  }

  const register = async (id, password) => {
    const response = await registerUser(id, password);

    setUser(response?.user_id ?? id);
    return response;
  };

  const updatePassword = async (user_id, currentPW, newPW) => {
    const response = await updatePasswordAPI(user_id, currentPW, newPW);
    return response
  };

  const deleteUser = async (user_id) => {
    const response = await deleteUserAPI(user_id);
    return response
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updatePassword,
        deleteUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
