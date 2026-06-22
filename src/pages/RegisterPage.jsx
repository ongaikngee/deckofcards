import React, { useState } from 'react'
import { useAuth } from "../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null)
	const [success, setSuccess] = useState(null)

	const { register } = useAuth()
	const navigate = useNavigate();

	const formRegister = async () => {
		setError(null)
		setSuccess(null)

		if (username.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") {
			setError("All fields are required.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Password is not matching...")
			return
		}

		try {
			await register(username, password);
			setSuccess("User registered successfully!");
			setUsername("");
			setPassword("");
			setConfirmPassword("");
		} catch (e) {
			console.error(e);
			setError(e?.message || "An error occurred during registration. Please try again.");
		}


	}

	return (
		<div className="container py-4">
			<h2>Register</h2>
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

				<div className="mb-3">
					<label htmlFor="inputConfirmPassword" className="forn-label">
						Confirm Password:
					</label>
					<input
						type="password"
						className="form-control"
						id="inputConfirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => formRegister({ username, password })}
				>
					Register
				</button>
				<button type="button" className="btn" onClick={() => navigate(`/login`)}>Back to Login</button>
			</form>
			{error && <div className='mt-5 alert alert-danger'>{error}</div>}
			{success && <div className='mt-5 alert alert-success'>{success}</div>}
		</div>
	)
}

export default RegisterPage