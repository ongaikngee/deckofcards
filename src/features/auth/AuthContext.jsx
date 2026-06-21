import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../../services/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(id, password) {
    const response = await loginUser(id, password);

    if (response.success) {
      setUser(response.user);
      return true;
    }

    return false;
  }

  function logout() {
    setUser(null);
  }

  const register = async (id, password) => {
    const response = await registerUser(id, password)
    if (response) {
      setUser("user");
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
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
