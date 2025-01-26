"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setIsDarkMode,
  setIsSidebarCollapsed,
} from "@/lib/redux/slices/globalSlice";
import { removeToken } from "@/lib/redux/slices/authSlice";
import { Menu, Moon, Sun, Settings, LogOut } from "lucide-react";
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
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center w-full mb-7 transition-all duration-300 px-4 md:px-0">
      {/* LEFT SIDE - MENU */}
      <div className="flex items-center space-x-4">
        <button
          className={`p-3 rounded-full transition-all duration-300 ${
            isMobile
              ? isSidebarCollapsed
                ? "ml-7"
                : "ml-64"
              : isSidebarCollapsed
              ? "ml-0"
              : "-ml-2"
          } ${isMenuClicked ? "bg-blue-200" : "bg-gray-100 hover:bg-blue-100"}`}
          onClick={handleMenuClick}
          aria-label="Toggle Sidebar"
        >
          <Menu
            className={`w-6 h-6 ${
              isSidebarCollapsed ? "text-grey-500" : "text-blue-500"
            }`}
          />
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-5">
        {/* User Role Display */}
        <div className="hidden md:flex items-center space-x-3 cursor-pointer">
          <span className="font-semibold">{userRole ?? "Guest"}</span>
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
