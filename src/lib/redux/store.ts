// src/redux/store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducer from "@/lib/redux/slices/globalSlice";
import authReducer from "@/lib/redux/slices/authSlice";
import toastReducer from "@/lib/redux/slices/toastSlice";
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

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const PERSIST_WHITELIST = ["global", "auth"];

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: PERSIST_WHITELIST,
};

const rootReducer = combineReducers({
  global: globalReducer,
  auth: authReducer,
  toast: toastReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV !== "production",
  });
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
