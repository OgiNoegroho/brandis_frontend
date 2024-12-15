"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice"; // Use Redux Toolkit slice

const LogIn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Dispatch action to save token in Redux store and local storage
      dispatch(setToken(data.token));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 responsive-margin">
      <div className="w-full max-w-[1600px] bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 bg-gray-200 border-r-4 border-gray-300 flex flex-col items-center justify-center px-8 sm:px-16 py-12 sm:py-20">
          <img src="/brandis_logo.png" alt="Brand Logo" className="h-28 sm:h-36 lg:h-48 mb-4 sm:mb-6" />
          <p className="text-gray-700 text-center text-sm sm:text-lg lg:text-xl font-semibold mt-4">
            Selamat Datang di Brandis!
          </p>
        </div>
        <div className="w-full lg:w-1/2 px-8 sm:px-16 py-12 sm:py-20 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-6 sm:mb-8">Login</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 text-center mb-4 sm:mb-6">Silahkan Login Disini</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email" // Add name attribute for form handling and accessibility
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email" // Add autocomplete attribute
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password" // Add name attribute for form handling and accessibility
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password" // Add autocomplete attribute for password
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
