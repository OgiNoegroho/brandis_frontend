// src/app/signIn/page.tsx

"use client";

import { ReactNode } from "react";

const SignInLayout = ({ children }: { children: ReactNode }) => {
  return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
            {children}
          </div>
        </div>
    
  );
};

export default SignInLayout;
