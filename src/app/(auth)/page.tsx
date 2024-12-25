"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setToken } from "@/redux/slices/authSlice"; // Use Redux Toolkit slice
import { Button, Card, Input } from "@nextui-org/react"; // Import NextUI Button
import { Eye, EyeOff } from "lucide-react";

const LogIn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        "https://brandis-backend.vercel.app/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

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
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16">
      <Card className="w-full max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[900px] 2xl:max-w-[1000px] bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Brand Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col items-center space-y-6">
            <img
              src="/brandis_logo.png"
              alt="Brand Logo"
              className="h-20 sm:h-24 lg:h-36 object-contain"
            />
            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Selamat Datang di Brandis!
              </h1>
              <p className="text-lg text-blue-100 max-w-md">
                Kelola bisnis Anda dengan lebih efisien dan profesional
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Login ke Akun Anda
            </h2>
            <p className="mt-2 text-gray-600">
              Silakan masukkan kredensial Anda
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            autoComplete="off"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2 text-gray-900"
                placeholder="nama@perusahaan.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2 text-gray-900 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Ingat saya</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Lupa password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LogIn;
