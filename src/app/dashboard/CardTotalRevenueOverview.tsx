'use client';


import React from "react";
import { useGetTotalRevenueQuery } from "@/app/redux/api"; // Adjust the import path
import { DollarSign } from "lucide-react";

const CardTotalRevenueOverview = () => {
  const { data: totalRevenue, isLoading, error } = useGetTotalRevenueQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="card">
      <div className="header">
        <h2>Total Revenue Overview</h2>
        <DollarSign className="icon" />
      </div>
      <div className="body">
        <h3>{`$${totalRevenue}`}</h3>
      </div>
    </div>
  );
};

export default CardTotalRevenueOverview;
