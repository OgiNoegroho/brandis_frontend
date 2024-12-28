// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getTokenFromLocalStorage,
  saveTokenToLocalStorage,
  removeTokenFromLocalStorage,
  getRoleFromToken,
  saveTokenToCookies,
  removeTokenFromCookies,
  getTokenFromCookies,
} from "@/utils/authUtils";
import { Role } from "@/types/auth";

interface AuthState {
  token: string | null;
  role: Role | null;
}

// Check both localStorage and cookies for existing token
const getInitialToken = (): string | null => {
  const localStorageToken = getTokenFromLocalStorage();
  const cookieToken = getTokenFromCookies();
  return localStorageToken || cookieToken;
};

const initialState: AuthState = {
  token: getInitialToken(),
  role: getInitialToken() ? getRoleFromToken(getInitialToken()!) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;
      state.role = getRoleFromToken(token);

      // Save token to both storage mechanisms
      Promise.all([
        saveTokenToLocalStorage(token),
        saveTokenToCookies(token),
      ]).catch((error) => {
        console.error("Error saving token:", error);
      });
    },
    removeToken: (state) => {
      state.token = null;
      state.role = null;

      // Remove token from both storage mechanisms
      Promise.all([
        removeTokenFromLocalStorage(),
        removeTokenFromCookies(),
      ]).catch((error) => {
        console.error("Error removing token:", error);
      });
    },
  },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;
