"use client";

import React, { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import "@/styles/globals.css";

const LogInLayout = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default LogInLayout;
