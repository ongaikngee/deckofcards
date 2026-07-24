import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    formLogin({ username, password });
  };

  const formLogin = async ({ username, password }) => {
    setError("");

    if (username.trim() === "" || password.trim() === "") {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      navigate("/");
    } catch (e) {
      console.error(e);
      setError(
        e?.message || "An error occurred during login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="inputUserName" className="form-label">
            Username:
          </label>
          <input
            type="text"
            className="form-control"
            id="inputUserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="inputPassword" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="inputPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ minWidth: "100px" }}
          disabled={loading}
        >
          {loading ? "Logging" : "Log in"}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => navigate(`/register`)}
        >
          Register
        </button>
      </form>
      {error && <div className="mt-3 alert alert-danger">{error}</div>}
    </div>
  );
};

export default LoginPage;
