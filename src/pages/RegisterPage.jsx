import React, { useState } from 'react'
import { useAuth } from "../features/auth/AuthContext";

const RegisterPage = () => {

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null)

	const { register } = useAuth()

	const formRegister = async () => {
		setError(null)

		if (password !== confirmPassword) {
			setError("Password is not matching...")
			return
		}

		try {
			const response = await register(username, password)
			if (response) {
				console.log("success")
			} else {
				console.log('not successful')
			}
		} catch (e) {
			console.error(e)
			throw new Error("Failed to register user.");
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
			</form>
			{error && <div className='mt-5 alert alert-danger'>{error}</div>}
		</div>
	)
}

export default RegisterPage