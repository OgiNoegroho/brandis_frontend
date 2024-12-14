// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTokenFromLocalStorage, saveTokenToLocalStorage, removeTokenFromLocalStorage, getRoleFromToken } from "@/utils/authUtils";
import { Role } from "@/types/auth";

interface AuthState {
  token: string | null;
  role: Role | null;
}

const initialState: AuthState = {
  token: getTokenFromLocalStorage(),
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      const role = getRoleFromToken(action.payload);
      state.role = (role as Role | null);
      saveTokenToLocalStorage(action.payload);
    },
    removeToken: (state) => {
      state.token = null;
      state.role = null;
      removeTokenFromLocalStorage();
    },
  },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;