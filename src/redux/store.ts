// src/app/redux/store.ts

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducer from "@/redux/state";  // Global reducer
import authReducer from "@/redux/authReducer";  // Correct path for auth reducer
import { setupListeners } from "@reduxjs/toolkit/query";  // Keep this import if needed for other RTK setup
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// No-op storage for SSR (Server-Side Rendering)
const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem() {
    return Promise.resolve();
  },
  removeItem() {
    return Promise.resolve();
  },
});

// Use web storage in the browser
const storage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["global"], // Only persist specific slices (e.g., global state)
};

// Combine reducers (auth, global)
const rootReducer = combineReducers({
  global: globalReducer,
  auth: authReducer, // Add auth reducer here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer, // Use persistedReducer instead of rootReducer directly
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore these actions for serialization
        },
      }),
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
  });

  // Setup listeners (if using RTK Query or other middleware that needs listeners)
  setupListeners(store.dispatch);

  return store;
};

// Export types for store, state, and dispatch
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
