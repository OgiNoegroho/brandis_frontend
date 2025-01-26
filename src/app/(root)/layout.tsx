"use client";

import React, { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const pathname = usePathname();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const isAuthPage = pathname === "/";

  if (isAuthPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {children}
      </div>
    );
  }

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default Layout;
