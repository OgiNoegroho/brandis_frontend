// src/app/signIn/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
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
      router.push("/dashboard");
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 h-[3px]">
      {/* Container utama dengan lebar tetap */}
      <div className="w-[1200px] h-[500px] bg-white shadow-lg rounded-lg overflow-hidden flex">
        
        {/* Panel Kiri - Logo */}
        <div className="w-1/2 bg-gray-100 flex flex-col items-center justify-center p-6">
          <img
            src="/brandis_logo.png" // Ganti dengan path logo Anda
            alt="Brand Logo"
            className="h-40 mb-4"
          />
          <p className="text-gray-700 text-lg font-semibold text-center">
            Selamat Datang di Brandis!
          </p>
        </div>

        {/* Panel Kanan - Form Login */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Login
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Welcome back! Please enter your details.
          </p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Input Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Input Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

            {/* Tombol Login */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
