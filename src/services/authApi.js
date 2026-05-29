// export async function login(username, password) {
//   try {
//     const response = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     if (!response.ok) {
//       throw new Error("Login failed");
//     }

//     const data = await response.json();
//     return data.token; // Assuming the token is returned in the response
//   } catch (error) {
//     console.error("Error during login:", error);
//     throw error;
//   }
// }

// export async function register(username, password) {
//   try {
//     const response = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });

//     if (!response.ok) {
//       throw new Error("Registration failed");
//     }
//   } catch (error) {
//     console.error("Error during registration:", error);
//     throw error;
//   }
// }

export async function loginUser(username, password) {
  // simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // fake validation
  if (username === "admin" && password === "password") {
    return {
      success: true,
      user: {
        id: 1,
        name: "John Doe",
      },
    };
  }

  return {
    success: false,
  };
}
