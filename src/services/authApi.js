const API_URL = import.meta.env.VITE_API_URL;


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

export const loginUser = async(username, password) => {
  const response = await fetch(`${API_URL}/users/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || "Login failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || "Registration failed";
    const error = new Error(errorMessage);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};


// export async function loginUser(username, password) {
//   // simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   // fake validation
//   if (username === "admin" && password === "password") {
//     return {
//       success: true,
//       user: {
//         id: 1,
//         name: "John Doe",
//       },
//     };
//   }

//   return {
//     success: false,
//   };
// }
