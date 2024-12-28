// unauthorized/pages.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks"; // Import dispatch
import { removeToken } from "@/redux/slices/authSlice"; // Import removeToken action

const Unauthorized = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {

    dispatch(removeToken());
  }, [dispatch]); 

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          You are not authorized to access this page.
        </h1>
        <p className="text-gray-600 mb-6">
          It looks like you don't have the right permissions. Please log in with
          the correct account.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
