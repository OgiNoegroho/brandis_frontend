// src/app/signIn/layout.tsx

"use client";

import { ReactNode } from "react";

const SignInLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>; // No wrapper, just the sign-in page content
};

export default SignInLayout;
