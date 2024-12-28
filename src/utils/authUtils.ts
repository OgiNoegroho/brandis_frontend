// src/utils/authUtils.ts
import jwt from "jsonwebtoken";
import { Role } from "@/types/auth";
import Cookies from "js-cookie";

const TOKEN_CONFIG = {
  storageKey: "authToken",
  cookieKey: "authToken",
  cookieOptions: {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};

const isBrowser = typeof window !== "undefined";

// Local Storage Functions
export const saveTokenToLocalStorage = (token: string): void => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(TOKEN_CONFIG.storageKey, token);
  } catch (error) {
    console.error("Failed to save token to localStorage:", error);
    throw error;
  }
};

export const getTokenFromLocalStorage = (): string | null => {
  if (!isBrowser) return null;

  try {
    return localStorage.getItem(TOKEN_CONFIG.storageKey);
  } catch (error) {
    console.error("Failed to get token from localStorage:", error);
    return null;
  }
};

export const removeTokenFromLocalStorage = (): void => {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(TOKEN_CONFIG.storageKey);
  } catch (error) {
    console.error("Failed to remove token from localStorage:", error);
    throw error;
  }
};

// Cookie Functions
export const saveTokenToCookies = (token: string): void => {
  if (!isBrowser) return;

  try {
    Cookies.set(TOKEN_CONFIG.cookieKey, token, TOKEN_CONFIG.cookieOptions);
  } catch (error) {
    console.error("Failed to save token to cookies:", error);
    throw error;
  }
};

export const getTokenFromCookies = (): string | null => {
  if (!isBrowser) return null;

  try {
    return Cookies.get(TOKEN_CONFIG.cookieKey) || null;
  } catch (error) {
    console.error("Failed to get token from cookies:", error);
    return null;
  }
};

export const removeTokenFromCookies = (): void => {
  if (!isBrowser) return;

  try {
    Cookies.remove(TOKEN_CONFIG.cookieKey, {
      path: TOKEN_CONFIG.cookieOptions.path,
    });
  } catch (error) {
    console.error("Failed to remove token from cookies:", error);
    throw error;
  }
};

// Token Decoding and Role Handling
export const getRoleFromToken = (token: string): Role | null => {
  try {
    const decoded = jwt.decode(token) as { peran?: Role };
    return decoded?.peran && isValidRole(decoded.peran) ? decoded.peran : null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const isValidRole = (role: string): role is Role => {
  const validRoles: Role[] = ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"];
  return validRoles.includes(role as Role);
};
