"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Divider,
} from "@nextui-org/react";
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
  const [outletData, setOutletData] = useState<OutletData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOutletDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/outlet/${id}`
        );

        if (!response.ok) {
          console.error(`Failed to fetch outlet details: ${response.status}`);
          return;
        }

        const data = await response.json();
        setOutletData({
          id: data.id,
          nama: data.nama,
          alamat: data.alamat,
          nomor_telepon: data.nomor_telepon,
        });
      } catch (err) {
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

  if (!outletData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Outlet not found.</div>
      </div>
    );
  }

  return (
    <div className="container px-12 sm:px-6 lg:pl-0 content">
      <Card className="mb-4">
        <CardHeader>
          <h1 className="text-3xl font-bold">{outletData.nama}</h1>
        </CardHeader>
        <Divider />
        <div className="grid grid-cols-1 gap-2 p-2">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
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
        aria-label="options"
        className="flex w-10/12 flex-col"
        variant="light"
      >
        <Tab key="stock" title={<div>Stok</div>}>
          <Card>
            <CardBody>
              <StockOverview outletId={outletData.id} />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="distribution" title={<div>Distribusi</div>}>
          <Card>
            <CardBody>
              <DistributionHistory outletId={outletData.id} />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="returns" title={<div>Retur</div>}>
          <Card>
            <CardBody>
              <ReturnManagement outletId={outletData.id} />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default OutletDetail;
