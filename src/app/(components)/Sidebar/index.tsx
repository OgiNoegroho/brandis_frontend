import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setIsSidebarCollapsed } from "@/app/redux/state";
import {
  Archive,
  Clipboard,
  Layout,
  LucideIcon,
  Users,
  House,
  ChartColumn,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  isSubLink?: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  isActive = false,
  isSubLink = false,
}: SidebarLinkProps) => {
  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed
            ? "justify-center py-4"
            : `justify-start ${isSubLink ? "pl-10" : "px-8"} py-4`
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors  ${
          isActive && isSubLink
            ? "text-xs font-semibold text-blue-700"
            : isActive
            ? "bg-blue-200 text-blue-500 font-bold"
            : "text-gray-700"
        }`}
      >
        <Icon className={`${isSubLink ? "w-4 h-4" : "w-6 h-6"}`} />
        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium ${isActive && isSubLink ? "font-bold" : ""} ${
            isSubLink ? "text-xs text-left" : ""
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [wasOpenBeforeMobile, setWasOpenBeforeMobile] = useState(false);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const pathname = usePathname();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const inventoryRef = useRef<HTMLDivElement>(null);

  // Check and update mobile state
  useEffect(() => {
    const checkMobileSize = () => {
      const mobile = window.innerWidth <= 768; // tailwind md breakpoint
      
      if (mobile !== isMobile) {
        // When transitioning to mobile and sidebar is not collapsed
        if (mobile && !isSidebarCollapsed) {
          setWasOpenBeforeMobile(true);
          dispatch(setIsSidebarCollapsed(true));
        }
        
        // When transitioning back from mobile and sidebar was open before
        if (!mobile && wasOpenBeforeMobile) {
          dispatch(setIsSidebarCollapsed(false));
          setWasOpenBeforeMobile(false);
        }
        
        setIsMobile(mobile);
      }
    };

    // Check on mount and add resize listener
    checkMobileSize();
    window.addEventListener('resize', checkMobileSize);

    return () => {
      window.removeEventListener('resize', checkMobileSize);
    };
  }, [dispatch, isMobile, isSidebarCollapsed, wasOpenBeforeMobile]);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleInventoryDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInventoryOpen(!isInventoryOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarCollapsed &&
        inventoryRef.current &&
        !inventoryRef.current.contains(event.target as Node)
      ) {
        setIsInventoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (
      !pathname.startsWith("/stockManagement") &&
      !pathname.startsWith("/batchManagement")
    ) {
      setIsInventoryOpen(false);
    }
  }, [pathname]);

  const isActiveTab = (tabPath: string) => pathname === tabPath;
  const isInventoryActive =
    pathname.startsWith("/stockManagement") ||
    pathname.startsWith("/batchManagement");

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-500 ease-in-out overflow-hidden h-full shadow-md z-40`;

  const CollapsedSubmenu = () => (
    <div className="absolute left-16 top-0 bg-white shadow-lg rounded-lg w-48 py-2 z-50">
      <Link href="/stockManagement">
        <div
          className={`px-4 py-3 hover:bg-blue-100 flex items-center gap-3 ${
            isActiveTab("/stockManagement")
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700"
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span className="text-sm">Stock Management</span>
        </div>
      </Link>
      <Link href="/batchManagement">
        <div
          className={`px-4 py-3 hover:bg-blue-100 flex items-center gap-3 ${
            isActiveTab("/batchManagement")
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700"
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span className="text-sm">Batch Management</span>
        </div>
      </Link>
    </div>
  );

  const ExpandedSubmenu = () => (
    <div className="">
      <SidebarLink
        href="/stockManagement"
        icon={Clipboard}
        label="Stock Management"
        isCollapsed={isSidebarCollapsed}
        isActive={isActiveTab("/stockManagement")}
        isSubLink={true}
      />
      <SidebarLink
        href="/batchManagement"
        icon={Clipboard}
        label="Batch Management"
        isCollapsed={isSidebarCollapsed}
        isActive={isActiveTab("/batchManagement")}
        isSubLink={true}
      />
    </div>
  );

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex items-center justify-between ${
          isSidebarCollapsed ? "px-4" : "px-8"
        } pt-8 transition-all duration-500`}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/brandis_logo.png"
            alt="Brandis Logo"
            width={isSidebarCollapsed ? 40 : 50}
            height={isSidebarCollapsed ? 40 : 50}
            className="rounded-full object-cover transition-all duration-500"
          />
          {!isSidebarCollapsed && (
            <h1 className="font-extrabold text-2xl transition-opacity duration-500">
              BRANDIS.
            </h1>
          )}
        </div>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/userManagement"
          icon={Users}
          label="User Management"
          isCollapsed={isSidebarCollapsed}
          isActive={!isInventoryActive && isActiveTab("/userManagement")}
        />
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
          isActive={!isInventoryActive && isActiveTab("/dashboard")}
        />
        <SidebarLink
          href="/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
          isActive={!isInventoryActive && isActiveTab("/products")}
        />

        {/* Inventory Section */}
        <div ref={inventoryRef} className="relative">
          <div
            onClick={toggleInventoryDropdown}
            className={`cursor-pointer flex items-center ${
              isSidebarCollapsed ? "justify-center" : "justify-between"
            } ${isSidebarCollapsed ? "py-4" : "px-8 py-4"} hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
              isInventoryActive ? "bg-blue-200 text-blue-700" : "text-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <Archive className="w-6 h-6" />
              {!isSidebarCollapsed && (
                <span className="font-medium">Inventory</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isInventoryOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {/* Conditional Submenu Rendering */}
          {isInventoryOpen &&
            (isSidebarCollapsed ? <CollapsedSubmenu /> : <ExpandedSubmenu />)}
        </div>

        <SidebarLink
          href="/outlets"
          icon={House}
          label="Outlets"
          isCollapsed={isSidebarCollapsed}
          isActive={!isInventoryActive && isActiveTab("/outlets")}
        />
        <SidebarLink
          href="/financialReports"
          icon={ChartColumn}
          label="Financial Reports"
          isCollapsed={isSidebarCollapsed}
          isActive={!isInventoryActive && isActiveTab("/financialReports")}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2024 Brandis</p>
      </div>
    </div>
  );
};

export default Sidebar;