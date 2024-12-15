"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardBody, Tabs, Tab } from "@nextui-org/react";
import { PhoneCall, MapPin } from "lucide-react";
import StockOverview from "./StockOverview";
import DistributionHistory from "./DistributionHistory";
import ReturnManagement from "./ReturnManagement";

interface OutletData {
  id: string;
  nama: string;
  alamat: string;
  nomor_telepon: string;
}

const OutletDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>("stock");
  const [outletData, setOutletData] = useState<OutletData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOutletDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3008/api/outlet/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch outlet details: ${response.status}`);
        }

        const data = await response.json();
        setOutletData({
          id: data.id,
          nama: data.nama,
          alamat: data.alamat,
          nomor_telepon: data.nomor_telepon,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching outlet details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOutletDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!outletData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Outlet not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-3xl font-bold">{outletData.nama}</h1>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{outletData.alamat}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <PhoneCall className="h-5 w-5" />
              <span>{outletData.nomor_telepon}</span>
            </div>
          </div>
        
      </Card>

      <Tabs
        aria-label="Outlet Details Tabs"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(String(key))}
        className="gap-4"
      >
        <Tab
          key="stock"
          title={
            <div
              className={`px-6 py-2 rounded-lg ${
                activeTab === "stock"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Stock Overview
            </div>
          }
        >
          <Card>
            <CardBody>
              {/* Pass outletId to StockOverview */}
              {outletData && <StockOverview outletId={outletData.id} />}
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="distribution"
          title={
            <div
              className={`px-6 py-2 rounded-lg ${
                activeTab === "distribution"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Distribution History
            </div>
          }
        >
          <Card>
            <CardBody>
              {typeof id === "string" ? <DistributionHistory outletId={id} /> : null}
            </CardBody>
          </Card>
        </Tab>

        <Tab
  key="returns"
  title={
    <div
      className={`px-6 py-2 rounded-lg ${
        activeTab === "returns"
          ? "bg-green-500 text-white"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      Return Management
    </div>
  }
>
  <Card>
    <CardBody>

      {typeof id === "string" ? 
      <ReturnManagement outletId={id} /> : null}
    </CardBody>
  </Card>
</Tab>
      </Tabs>
    </div>
  );
};

export default OutletDetail;
