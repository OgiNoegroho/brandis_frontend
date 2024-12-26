import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsSidebarCollapsed } from "@/redux/slices/globalSlice";
import { removeToken } from "@/redux/slices/authSlice";
import {
  Archive,
  Clipboard,
  Layout,
  LucideIcon,
  Users,
  House,
  ChartColumn,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { Role } from "@/types/auth";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  isSubLink?: boolean;
}

interface SidebarLink {
  href: string;
  icon: LucideIcon;
  label: string;
  roles: Role[];
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
          className={`${isCollapsed ? "hidden" : "block"} font-medium ${
            isActive && isSubLink ? "font-bold" : ""
          } ${isSubLink ? "text-xs text-left" : ""}`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [wasOpenBeforeMobile, setWasOpenBeforeMobile] = useState(false);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const role = useAppSelector((state) => state.auth.role) as Role | null;
  const pathname = usePathname();
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const inventoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobileSize = () => {
      const mobile = window.innerWidth <= 768;

      if (mobile !== isMobile) {
        if (mobile && !isSidebarCollapsed) {
          setWasOpenBeforeMobile(true);
          dispatch(setIsSidebarCollapsed(true));
        }

        if (!mobile && wasOpenBeforeMobile) {
          dispatch(setIsSidebarCollapsed(false));
          setWasOpenBeforeMobile(false);
        }

        setIsMobile(mobile);
      }
    };

    checkMobileSize();
    window.addEventListener("resize", checkMobileSize);

    return () => {
      window.removeEventListener("resize", checkMobileSize);
    };
  }, [dispatch, isMobile, isSidebarCollapsed, wasOpenBeforeMobile]);

  const toggleInventoryDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsInventoryOpen(!isInventoryOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
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
  }, []);

  useEffect(() => {
    if (
      !pathname.startsWith("/inventory/stockManagement") &&
      !pathname.startsWith("/inventory/batchManagement")
    ) {
      setIsInventoryOpen(false);
    }
  }, [pathname]);

  const isActiveTab = (tabPath: string): boolean => {
    if (tabPath.startsWith("/dashboard")) {
      const dashboardLinks: Record<Role, string> = {
        Pimpinan: "/dashboard/pimpinan",
        Manajer: "/dashboard/manajer",
        Pemasaran: "/dashboard/pemasaran",
        Bendahara: "/dashboard/bendahara",
      };
      return pathname === dashboardLinks[role!];
    }

    return pathname === tabPath;
  };


  const isInventoryActive = (): boolean =>
    pathname.startsWith("/inventory/stockManagement") ||
    pathname.startsWith("/inventory/batchManagement");

  const getSidebarLinks = (): SidebarLink[] => {
    const dashboardLinks: Record<Role, string> = {
      Pimpinan: "/dashboard/pimpinan",
      Manajer: "/dashboard/manajer",
      Pemasaran: "/dashboard/pemasaran",
      Bendahara: "/dashboard/bendahara",
    };

    const links: SidebarLink[] = [
      {
        href: "/userManagement",
        icon: Users,
        label: "Manajemen Pengguna",
        roles: ["Pimpinan"],
      },
      {
        href: dashboardLinks[role!], // Dynamically assign the href based on role
        icon: Layout,
        label: "Dashboard",
        roles: ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"],
      },
      {
        href: "/products",
        icon: Clipboard,
        label: "Produk",
        roles: ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"],
      },
      {
        href: "/outlets",
        icon: House,
        label: "Outlet",
        roles: ["Pimpinan", "Manajer", "Pemasaran"],
      },
      {
        href: "/financialReports",
        icon: ChartColumn,
        label: "Laporan Outlet",
        roles: ["Pimpinan", "Manajer", "Bendahara"],
      },
    ];

    if (!role) return [];

    return links.filter((link) => link.roles.includes(role));
  };


  const CollapsedSubmenu: React.FC = () => (
    <div className="absolute left-16 top-0 bg-white shadow-lg rounded-lg w-48 py-2 z-50">
      <Link href="/inventory/stockManagement">
        <div
          className={`px-4 py-3 hover:bg-blue-100 flex items-center gap-3 ${
            isActiveTab("/inventory/stockManagement")
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700"
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span className="text-sm">Manajemen Stok</span>
        </div>
      </Link>
      <Link href="/inventory/batchManagement">
        <div
          className={`px-4 py-3 hover:bg-blue-100 flex items-center gap-3 ${
            isActiveTab("/inventory/batchManagement")
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700"
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span className="text-sm">Manajemen Batch</span>
        </div>
      </Link>
    </div>
  );

  const ExpandedSubmenu: React.FC = () => (
    <div>
      <SidebarLink
        href="/inventory/stockManagement"
        icon={Clipboard}
        label="Manajemen Stok"
        isCollapsed={isSidebarCollapsed}
        isActive={isActiveTab("/inventory/stockManagement")}
        isSubLink={true}
      />
      <SidebarLink
        href="/inventory/batchManagement"
        icon={Clipboard}
        label="Manajemen Batch"
        isCollapsed={isSidebarCollapsed}
        isActive={isActiveTab("/inventory/batchManagement")}
        isSubLink={true}
      />
    </div>
  );

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-500 ease-in-out overflow-block h-full shadow-md z-40`;

  // Only render the sidebar if we have a valid role
  if (!role) return null;

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
        {getSidebarLinks().map((link) => {
          // Render sidebar links up to Products
          const isProductLink = link.href === "/products";
          return (
            <React.Fragment key={link.href}>
              <SidebarLink
                href={link.href}
                icon={link.icon}
                label={link.label}
                isCollapsed={isSidebarCollapsed}
                isActive={isActiveTab(link.href)}
                isSubLink={link.isSubLink}
              />
              {/* Add Inventory section immediately after Products */}
              {isProductLink && (role === "Pimpinan" || role === "Manajer") && (
                <div ref={inventoryRef} className="relative">
                  <div
                    onClick={toggleInventoryDropdown}
                    className={`cursor-pointer flex items-center ${
                      isSidebarCollapsed ? "justify-center" : "justify-between"
                    } ${
                      isSidebarCollapsed ? "py-4" : "px-8 py-4"
                    } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
                      isInventoryActive()
                        ? "bg-blue-200 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Archive className="w-6 h-6" />
                      {!isSidebarCollapsed && (
                        <span className="font-medium">Inventaris</span>
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

                  {isInventoryOpen &&
                    (isSidebarCollapsed ? (
                      <CollapsedSubmenu />
                    ) : (
                      <ExpandedSubmenu />
                    ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* FOOTER */}
      <div
        className={`${
          isSidebarCollapsed ? "hidden" : "flex flex-col"
        } mb-10 px-8`}
      >
        <p className="text-center text-xs text-gray-500 mt-2">
          &copy; 2024 Brandis
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
