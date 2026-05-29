import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();


  const formLogin = async ({ username, password }) => {
    try {
      const response = await login(username, password);

      if (response) {
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container py-4">
      <h2>Login</h2>
      <form>
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
          <label htmlFor="inputPassword" className="forn-label">
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
          type="button"
          className="btn btn-primary"
          onClick={() => formLogin({ username, password })}
        >
          Log in
        </button>
      </form>

      {/* <form onSubmit={handleSubmit}>
        <div>
          <label>ID</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>} */}

      <div className="my-2 text-danger">{error && <p>{error}</p>}</div>
    </div>
  );
};

export default LoginPage;
