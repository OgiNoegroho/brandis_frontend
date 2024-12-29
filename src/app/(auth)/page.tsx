"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setToken } from "@/redux/slices/authSlice";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";
import { Button, Card, Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";

const LogIn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal login. Silakan cek kembali kredensial Anda.");
      }

      const data = await response.json();
      dispatch(setToken(data.token));

      dispatch(
        showSuccessToast({
          message: "Login berhasil! Anda akan diarahkan ke dashboard.",
          isDarkMode,
        })
      );

      router.push("/dashboard");
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Login gagal. Silakan cek kembali kredensial Anda.",
          isDarkMode,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16">
      <Card className="w-full max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[900px] 2xl:max-w-[1000px] bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Brand Section */}
        <div
          className="w-full lg:w-1/2 bg-contain bg-center flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dcwyr2sog/image/upload/v1735138539/Brandis/yvsozswglng42ckd0mgo.jpg')",
          }}
        >
          <div className="flex flex-col items-center space-y-6">
            <img
              src="https://res.cloudinary.com/dcwyr2sog/image/upload/f_auto,q_auto/v1/Brandis/akaaskzvkau4droz783h"
              alt="Brand Logo"
              className="h-20 sm:h-24 lg:h-36 object-contain"
            />
            <div className="text-center space-y-4">
              <h1
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                  isDarkMode ? "text-gray-900" : "text-black"
                }`}
              >
                Selamat Datang di Brandis!
              </h1>
              <p
                className={`text-lg max-w-md ${
                  isDarkMode ? "text-gray-900" : "text-black"
                }`}
              >
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
                placeholder="Nama@gmail.com"
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
