
'use client';
import React from "react";
import { useGetOutletPerformanceQuery } from "@/app/redux/api"; // Adjust the import path

const CardOutletPerformance = () => {
  const { data: outletPerformance = [], isLoading, error } = useGetOutletPerformanceQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="card">
      <div className="header">
        <h2>Outlet Performance</h2>
      </div>
      <div className="body">
        {outletPerformance.length === 0 ? (
          <p>No performance data available</p>
        ) : (
          <ul>
            {outletPerformance.map((outlet) => (
              <li key={outlet.outletId}>
                {outlet.outletName} - Sold: {outlet.totalSold} products, Revenue: ${outlet.revenue}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CardOutletPerformance;
