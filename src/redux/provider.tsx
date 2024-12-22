// src\redux\provider.tsx

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore } from "./store"; // Import the makeStore function
import { AppStore } from "./store"; // Import AppStore type
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// StoreProvider component
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistStore(storeRef.current)}>
        {children}
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}
