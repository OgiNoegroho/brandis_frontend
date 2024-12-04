"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/redux/state";
import { Bell, Menu, Moon, Settings, Sun, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial width
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkMobile);
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

  return (
    <div className="flex justify-between items-center w-full mb-7 transition-all duration-300 px-4 md:px-0">
      {/* LEFT SIDE - MENU AND SEARCH */}
      <div className="flex items-center space-x-4 w-full">
        {/* Hamburger Menu */}
        <button
          className={`
            p-3 rounded-full transition-all duration-300 
            ${
              // Mobile condition
              isMobile 
                ? (isSidebarCollapsed ? 'ml-7' : 'ml-64')
                : // Desktop condition
                (isSidebarCollapsed ? 'ml-0' : '-ml-2')
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

        {/* Search Input - Mobile Responsive */}
        <div 
          className={`
            relative flex-grow max-w-md
            md:block 
            ${isSidebarCollapsed ? 'block' : 'hidden'}
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

    

          {/* User Profile */}
          <div className="flex items-center space-x-3 cursor-pointer">
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