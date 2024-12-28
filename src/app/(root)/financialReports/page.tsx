"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { showErrorToast } from "@/redux/slices/toastSlice";

interface Outlet {
  id: string;
  nama: string;
  alamat: string;
  nomor_telepon: string;
}

const FinancialReports = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  const [outlets, setOutlets] = useState<Outlet[]>([]);

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
          message:
            error instanceof Error ? error.message : "Sebuah kesalahan terjadi",
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
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-2xl font-bold mb-6">Laporan Outlet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outlets.map((outlet) => (
          <Card key={outlet.id} className="shadow-md flex flex-col h-full">
            <CardBody className="flex-grow">
              <div>
                <h2 className="text-lg font-semibold">{outlet.nama}</h2>
                <p className="text-sm text-gray-600">{outlet.alamat}</p>
                <p className="text-sm text-gray-600">{outlet.nomor_telepon}</p>
              </div>
            </CardBody>

            <CardFooter className="flex justify-end items-center space-x-2 mt-4">
              <Button
                onPress={() => handleViewDetails(outlet.id)}
                variant="flat"
                color="primary"
                size="sm"
              >
                Detail
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialReports;