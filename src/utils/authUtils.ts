// src/utils/authUtils.ts

export const saveTokenToLocalStorage = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem("authToken");
};

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("authToken");
};
