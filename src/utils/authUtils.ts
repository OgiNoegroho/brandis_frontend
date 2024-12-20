// src/utils/authUtils.ts
import jwt from "jsonwebtoken";
import { Role } from "@/types/auth";

const LOCAL_STORAGE_TOKEN_KEY = "authToken";
const isBrowser = typeof window !== "undefined";

export const saveTokenToLocalStorage = (token: string): void => {
  if (isBrowser) {
    try {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    } catch (error) {
      console.error("Failed to save token:", error);
    }
  }
};

export const removeTokenFromLocalStorage = (): void => {
  if (isBrowser) {
    try {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  }
};

export const getTokenFromLocalStorage = (): string | null => {
  if (isBrowser) {
    try {
      return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  }
  return null;
};

export const getRoleFromToken = (token: string): Role | null => {
  try {
    const decoded = jwt.decode(token) as { peran?: Role };

    // Validate that the role is one of the allowed types
    if (decoded?.peran && isValidRole(decoded.peran)) {
      return decoded.peran;
    }
    return null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

// Type guard to ensure role is valid
const isValidRole = (role: string): role is Role => {
  const validRoles: Role[] = ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"];
  return validRoles.includes(role as Role);
};
