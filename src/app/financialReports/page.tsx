"use client"

import React from "react";
import Link from "next/link"; // Next.js Link for navigation

type Outlet = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
};

const FinancialReports: React.FC = () => {
  const outlets: Outlet[] = [
    {
      id: "1",
      name: "Outlet A",
      address: "123 Main St",
      phoneNumber: "123-456-7890",
    },
    {
      id: "2",
      name: "Outlet B",
      address: "456 Elm St",
      phoneNumber: "987-654-3210",
    },
  ];

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">Financial Reports</h1>

      {/* Outlet List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition flex items-center justify-between"
          >
            <div>
              <h4 className="text-lg font-bold">{outlet.name}</h4>
              <p className="text-sm text-gray-600">{`ID: ${outlet.id}`}</p>
              <p className="text-sm text-gray-600">{outlet.address}</p>
              <p className="text-sm text-gray-600">{outlet.phoneNumber}</p>
            </div>
            {/* Link to the details page */}
            <Link
              href={`/financialReports/${outlet.id}`} // Link to the outlet details page using dynamic routing
              passHref
            >
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                Detail
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialReports;
