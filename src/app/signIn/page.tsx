"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/hooks"; // Custom hook to dispatch actions
import { setToken } from "@/app/redux/authActions"; // Action to store token
import Link from "next/link";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send POST request to backend login API
    try {
      const response = await fetch("http://localhost:3008/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();

      // Dispatch token to Redux
      dispatch(setToken(data.token));

      // Redirect user after successful login
      router.push("/dashboard"); // Example redirect after successful login
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign In</button>
      </form>

      <p>
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
