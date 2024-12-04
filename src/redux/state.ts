// src\app\redux\state.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for the global slice
interface GlobalState {
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
}

const initialState: GlobalState = {
  isDarkMode: false,
  isSidebarCollapsed: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
  },
});

export const { setIsDarkMode, setIsSidebarCollapsed } = globalSlice.actions;

export default globalSlice.reducer;
