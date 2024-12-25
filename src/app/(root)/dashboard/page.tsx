"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { Role } from "@/types/auth";

const DashboardPage = () => {
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.role) as Role | null;

  useEffect(() => {
    if (role) {
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
  }, [role, router]);
  
  return <div>Loading...</div>;
};

export default DashboardPage;
