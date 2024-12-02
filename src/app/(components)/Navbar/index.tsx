"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/app/redux/state";
import { Bell, Menu, Moon, Settings, Sun, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <div
      className={`flex justify-between items-center w-full mb-7 transition-all duration-300 ${
        isSidebarCollapsed ? "pr-4 md:pr-8" : ""
      }`}
    >
      {/* LEFT SIDE */}
      <div
        className={`flex justify-between items-center ${
          isSidebarCollapsed ? "gap-5" : "gap-0"
        }`}
      >
        {/* Hamburger Menu */}
        <button
          className={`p-3 rounded-full transition-all duration-300 ${
            isSidebarCollapsed
              ? "bg-gray-100 hover:bg-blue-100"
              : "bg-blue-100 hover:bg-blue-200"
          } ${
            !isSidebarCollapsed ? "ml-auto md:ml-0" : ""
          }`} /* Move the menu button to the right on mobile */
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <Menu
            className={`w-6 h-6 text-gray-500 transition-transform ${
              isSidebarCollapsed ? "" : "rotate-90 text-blue-500"
            }`}
          />
        </button>

        {/* Search Input */}
        {isSidebarCollapsed ? (
          // Show search input only when sidebar is collapsed (icons-only mode)
          <div className="relative md:block">
            <input
              type="search"
              placeholder="Start typing to search groups & products"
              className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-500" size={20} />
            </div>
          </div>
        ) : (
          // Hide search input on mobile when sidebar is not collapsed
          <div className="hidden md:block relative">
            <input
              type="search"
              placeholder="Start typing to search groups & products"
              className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-500" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="hover:text-blue-500"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="cursor-pointer text-gray-500" size={24} />
            ) : (
              <Moon className="cursor-pointer text-gray-500" size={24} />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <Bell className="cursor-pointer text-gray-500" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
              3
            </span>
          </div>

          {/* Divider */}
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/user_logo.png"
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full h-full object-cover"
            />
            <span className="font-semibold">Pimpinan</span>
          </div>
        </div>

        {/* Settings Icon */}
        <Link href="/settings">
          <Settings
            className="cursor-pointer text-gray-500 hover:text-blue-500"
            size={24}
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
