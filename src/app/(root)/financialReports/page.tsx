"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks"; // Importing the useAppSelector hook
import { RootState } from "@/redux/store"; // Importing RootState to access global state
import {
  Button,
} from "@nextui-org/react";

interface Outlet {
  id: string;
  nama: string;
  alamat: string;
  nomor_telepon: string;
}

const FinancialReports = () => {
  const router = useRouter();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access the token from Redux state
  const token = useAppSelector((state: RootState) => state.auth.token);

  // Fetch outlets with proper error handling
  const fetchOutlets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        "https://brandis-backend.vercel.app/api/outlet",
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
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching outlets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, [token]); // Re-fetch outlets if token changes

  
  const handleViewDetails = (id: string) => {
    router.push(`/financialReports/${id}`);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading outlets...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
        <Button
          onClick={fetchOutlets}
          className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="pl-12">
      <h1 className="text-2xl font-bold mb-2">Financial Reports</h1>

      {outlets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No outlets found.</div>
      ) : (
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
      )}
    </div>
  );
};

export default FinancialReports;
