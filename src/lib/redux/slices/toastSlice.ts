// src\redux\slices\globalSlices.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast, ToastOptions } from "react-toastify";

interface ToastPayload {
  message: string;
  options?: ToastOptions;
  isDarkMode: boolean;
}

const toastSlice = createSlice({
  name: "toast",
  initialState: {},
  reducers: {
    showSuccessToast: (state, action: PayloadAction<ToastPayload>) => {
      const { message, options, isDarkMode } = action.payload;
      toast.success(message, {
        position: "bottom-right",
        autoClose: 3000,
        ...options,
        style: {
          backgroundColor: isDarkMode ? "#333" : "#f4f4f4",
          color: isDarkMode ? "#fff" : "#000",
        },
      });
    },
    showErrorToast: (state, action: PayloadAction<ToastPayload>) => {
      const { message, options, isDarkMode } = action.payload;
      toast.error(message, {
        position: "bottom-right",
        autoClose: 3000,
        ...options,
        style: {
          backgroundColor: isDarkMode ? "#e74c3c" : "#f2d7d5", // Red for errors
          color: isDarkMode ? "#fff" : "#000",
        },
      });
    },
    showInfoToast: (state, action: PayloadAction<ToastPayload>) => {
      const { message, options, isDarkMode } = action.payload;
      toast.info(message, {
        position: "bottom-right",
        autoClose: 3000,
        ...options,
        style: {
          backgroundColor: isDarkMode ? "#3498db" : "#aed6f1", // Info toast color
          color: isDarkMode ? "#fff" : "#000",
        },
      });
    },
    showWarningToast: (state, action: PayloadAction<ToastPayload>) => {
      const { message, options, isDarkMode } = action.payload;
      toast.warn(message, {
        position: "bottom-right",
        autoClose: 3000,
        ...options,
        style: {
          backgroundColor: isDarkMode ? "#f39c12" : "#f9e79f", // Warning toast color
          color: isDarkMode ? "#fff" : "#000",
        },
      });
    },
  },
});

export const {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
} = toastSlice.actions;

export default toastSlice.reducer;
