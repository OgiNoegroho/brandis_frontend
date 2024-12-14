"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks"; // Import the useAppSelector hook to access the Redux state
import { useRouter } from "next/navigation"; // For programmatic navigation
import { Role } from "@/types/auth"; // Import Role type from types/auth

const DashboardPage = () => {
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.role) as Role | null; // Ensure the role is typed as Role

  useEffect(() => {
    if (role) {
      // Redirect the user based on their role
      if (role === "Pimpinan") {
        router.push("/dashboard/pimpinan");
      } else if (role === "Manajer") {
        router.push("/dashboard/manajer");
      } else if (role === "Pemasaran") {
        router.push("/dashboard/pemasaran");
      } else if (role === "Bendahara") {
        router.push("/dashboard/bendahara");
      }
    }
  }, [role, router]); // Run this effect whenever the role changes

  // Optionally, render a loading state or message while waiting for the role to be determined
  return <div>Loading...</div>;
};

export default DashboardPage;
