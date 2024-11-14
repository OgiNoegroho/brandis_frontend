// app/outlet/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Using next/navigation for client-side navigation

interface Outlet {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
}

const Outlet = () => {
  const router = useRouter(); // This comes from next/navigation

  const outlets: Outlet[] = [
    { id: "1", name: "Outlet A", address: "123 Main St", phoneNumber: "123-456-7890" },
    { id: "2", name: "Outlet B", address: "456 Elm St", phoneNumber: "987-654-3210" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Outlets</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => alert("Create New Outlet Feature")}
      >
        + Create New Outlet
      </button>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="flex justify-between items-center border-b p-4 hover:bg-gray-100 transition"
          >
            <div>
              <h2 className="text-lg font-semibold">{outlet.name}</h2>
              <p className="text-sm text-gray-600">{outlet.address}</p>
              <p className="text-sm text-gray-600">{outlet.phoneNumber}</p>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-blue-500"
                onClick={() => alert("Edit outlet feature")}
              >
                Edit
              </button>
              <button
                className="text-blue-500"
                onClick={() => router.push(`/outletDetails/${outlet.id}`)} // Use `router.push` from next/navigation
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outlet;
