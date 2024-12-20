"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setIsDarkMode,
  setIsSidebarCollapsed,
} from "@/redux/slices/globalSlice";
import { removeToken } from "@/redux/slices/authSlice";
import { Bell, Menu, Moon, Sun, Search, Settings, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Role } from "@/types/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const userRole: Role | null = useAppSelector((state) => state.auth.role);

  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const handleMenuClick = () => {
    setIsMenuClicked(!isMenuClicked);
    toggleSidebar();
  };

  const handleLogout = () => {
    dispatch(removeToken());
    router.push("/logIn");
  };

  return (
    <div className="flex justify-between items-center w-full mb-7 transition-all duration-300 px-4 md:px-0">
      {/* LEFT SIDE - MENU AND SEARCH */}
      <div className="flex items-center space-x-4 w-full">
        <button
          className={`
            p-3 rounded-full transition-all duration-300 
            ${
              isMobile
                ? isSidebarCollapsed
                  ? "ml-7"
                  : "ml-64"
                : isSidebarCollapsed
                ? "ml-0"
                : "-ml-2"
            }
            ${isMenuClicked ? "bg-blue-200" : "bg-gray-100 hover:bg-blue-100"}
          `}
          onClick={handleMenuClick}
          aria-label="Toggle Sidebar"
        >
          <Menu
            className={`w-6 h-6 ${
              isSidebarCollapsed ? "text-grey-500" : "text-blue-500"
            }`}
          />
        </button>

        <div
          className={`
            relative flex-grow max-w-md
            md:block 
            ${isSidebarCollapsed ? "block" : "hidden"}
            md:block
          `}
        >
          <input
            type="search"
            placeholder="Start typing to search groups & products"
            className="pl-10 pr-4 py-2 w-full border-2 border-gray-300 bg-white rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-5">
        <div className="hidden md:flex items-center space-x-5">
          {/* Notifications */}
          <div className="relative">
            <Bell className="cursor-pointer text-gray-500" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
              3
            </span>
          </div>

          {/* User Role Display */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <span className="font-semibold">{userRole ?? "Guest"}</span>
          </div>
        </div>

        {/* Dropdown Menu for Settings */}
        <Dropdown>
          <DropdownTrigger>
            <button className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-blue-100">
              <Settings className="text-gray-500" size={24} />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Settings Menu">
            <DropdownItem key="theme" onClick={toggleDarkMode}>
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <Sun className="cursor-pointer text-gray-500" size={20} />
                ) : (
                  <Moon className="cursor-pointer text-gray-500" size={20} />
                )}
                <span className="text-gray-500">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </div>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              <div className="flex items-center space-x-2">
                <LogOut className="text-gray-500" size={20} />
                <span>Log Out</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
