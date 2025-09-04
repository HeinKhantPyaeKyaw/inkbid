// import React, { useState } from "react";
// import { useAuth } from "../context/context";
// import { axiosClient } from "../../hooks/axiosClient";

// export const Register = async (e: React.FormEvent) => {
//   const { register, getToken } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [role, setRole] = useState<string | null>(null);

//   return {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     if (!role) {
//       setError("Please choose a role");
//       setLoading(false);
//       return;
//     }
//     try {
//       await register(email, password);
//       // Get token after registration
//       const token = await getToken();
//       // Only call backend if Firebase registration succeeds
//       await axiosClient.post(
//         "/portal/register",
//         {
//           username,
//           email,
//           company,
//           role,
//         },
//         {
//           headers: {
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     } catch (err: any) {
//       setError("Registration failed");
//       setLoading(false);
//       return;
//     }
//     setLoading(false);
//   };
// }