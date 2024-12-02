"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardBody, Tabs, Tab } from "@nextui-org/react";
import { PhoneCall, MapPin } from "lucide-react";
import StockOverview from './StockOverview';
import DistributionHistory from './DistributionHistory';
import ReturnManagement from './ReturnManagement';

interface OutletData {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
}

const OutletDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>('stock');
  const [outletData, setOutletData] = useState<OutletData | null>(null);

  useEffect(() => {
    if (id) {
      const outletId = Array.isArray(id) ? id[0] : id;
      const fetchedOutletData: OutletData = {
        id: outletId,
        name: `Outlet ${outletId}`,
        address: outletId === '1' ? '123 Main St' : '456 Elm St',
        phoneNumber: outletId === '1' ? '123-456-7890' : '987-654-3210',
      };
      setOutletData(fetchedOutletData);
    }
  }, [id]);

  if (!outletData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-3xl font-bold">{outletData.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{outletData.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <PhoneCall className="h-5 w-5" />
              <span>{outletData.phoneNumber}</span>
            </div>
          </div>
        </CardHeader>
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
            <div className={`px-6 py-2 rounded-lg ${
              activeTab === 'stock' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}>
              Stock Overview
            </div>
          }
        >
          <Card>
            <CardBody>
              <StockOverview />
            </CardBody>
          </Card>
        </Tab>

        <Tab 
          key="distribution" 
          title={
            <div className={`px-6 py-2 rounded-lg ${
              activeTab === 'distribution' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}>
              Distribution History
            </div>
          }
        >
          <Card>
            <CardBody>
              <DistributionHistory />
            </CardBody>
          </Card>
        </Tab>

        <Tab 
          key="returns" 
          title={
            <div className={`px-6 py-2 rounded-lg ${
              activeTab === 'returns' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}>
              Return Management
            </div>
          }
        >
          <Card>
            <CardBody>
              <ReturnManagement />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default OutletDetail;