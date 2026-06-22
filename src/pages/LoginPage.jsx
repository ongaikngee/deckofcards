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
    if (username.trim() === "" || password.trim() === "" ) {
			setError("All fields are required.");
			return;
		}


    try {
      console.log("helloooo, logining")
      const response = await login(username, password);
      console.log('no prob', response)
      navigate("/");
    } catch (e) {
			console.error(e);
			setError(e?.message || "An error occurred during login. Please try again.");
    }



    // try {
		// 	await register(username, password);
		// 	setSuccess("User registered successfully!");
		// 	setUsername("");
		// 	setPassword("");
		// 	setConfirmPassword("");
		// } catch (e) {
		// 	console.error(e);
		// 	setError(e?.message || "An error occurred during registration. Please try again.");
		// }



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
        <button
          type="button"
          className="btn"
          onClick={() => navigate(`/register`)}
        >
          Register
        </button>
      </form>
      {/* <div className="mt-2 alert alert-danger">{error && <p>{error}</p>}</div> */}
      {error && <div className="mt-3 alert alert-danger">{error}</div>}
    </div>
  );
};

export default LoginPage;
