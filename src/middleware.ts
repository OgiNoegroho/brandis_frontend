import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@/types/auth";

// Define allowed roles for each path
const allowedRoles = {
  "/userManagement": ["Pimpinan"],
  "/dashboard/pimpinan": ["Pimpinan"],
  "/dashboard/manajer": ["Manajer"],
  "/dashboard/pemasaran": ["Pemasaran"],
  "/dashboard/bendahara": ["Bendahara"],
  "/products": ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"],
  "/outlets": ["Pimpinan", "Manajer", "Pemasaran"],
  "/financialReports": ["Pimpinan", "Bendahara"],
  "/inventory/stockManagement": ["Pimpinan", "Manajer"],
  "/inventory/batchManagement": ["Pimpinan", "Manajer"],
  "/inventory": ["Pimpinan", "Manajer"],
  // Add more paths as needed
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value; 
  const pathname = request.nextUrl.pathname;


  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const decoded = jwt.decode(token) as { peran?: Role };

  const role = decoded?.peran;

  if (!role) {
    return NextResponse.redirect(new URL("/", request.url)); 
  }

  // Cast pathname to keyof typeof allowedRoles to satisfy TypeScript indexing
  const allowed = allowedRoles[pathname as keyof typeof allowedRoles];

  if (allowed && !allowed.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url)); // Redirect if user doesn't have the correct role
  }

  return NextResponse.next();
}

// Define which paths this middleware should be applied to
export const config = {
  matcher: [
    "/userManagement",
    "/dashboard/pimpinan",
    "/dashboard/manajer",
    "/dashboard/pemasaran",
    "/dashboard/bendahara",
    "/products",
    "/outlets",
    "/financialReports",
    "/inventory/stockManagement",
    "/inventory/batchManagement"
  ],
};
