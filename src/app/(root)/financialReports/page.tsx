"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Button } from "@nextui-org/react";
import { showErrorToast } from "@/redux/slices/toastSlice";

interface Outlet {
  id: string;
  nama: string;
  alamat: string;
  nomor_telepon: string;
}

const FinancialReports = () => {
  const router = useRouter();
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  const fetchOutlets = async () => {
    try {
      if (!token) {
        throw new Error("Token tidak ditemukan, silahkan login!");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/outlet`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutlets(data);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: error instanceof Error ? error.message : "Sebuah kesalahan terjadi",
          isDarkMode,
        })
      );
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, [token]);

  const handleViewDetails = (id: string) => {
    router.push(`/financialReports/${id}`);
  };

  return (
    <div className="pl-12">
      <h1 className="text-2xl font-bold mb-2">Laporan Outlet</h1>

     
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {outlets.map((outlet) => (
            <div
              key={outlet.id}
              className="flex justify-between items-center border-b p-5 hover:bg-gray-100 transition"
            >
              <div>
                <h2 className="text-lg font-semibold">{outlet.nama}</h2>
                <p className="text-sm text-gray-600">{outlet.alamat}</p>
                <p className="text-sm text-gray-600">{outlet.nomor_telepon}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleViewDetails(outlet.id)}
                  color="primary"
                  variant="flat"
                >
                  Detail
                </Button>
              </div>
            </div>
          ))}
        </div>
      
    </div>
  );
};

export default FinancialReports;
