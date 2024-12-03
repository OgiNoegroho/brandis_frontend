'use client';

import React from "react";
import { useGetTotalProductsSoldQuery } from "@/app/redux/api"; // Adjust the import path

const CardTotalProductsSold = () => {
  const { data: totalProductsSold, isLoading, error } = useGetTotalProductsSoldQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="card">
      <div className="header">
        <h2>Total Products Sold</h2>
      </div>
      <div className="body">
        <h3>{totalProductsSold}</h3>
      </div>
    </div>
  );
};

export default CardTotalProductsSold;
