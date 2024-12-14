"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation"; // Use useParams from next/navigation

type DistributionEntry = {
  invoiceCode: string;
  saleDate: string;
  productName: string;
  batchName: string;
  quantity: string;
  outletName: string;
  outletId: string;
};

type Outlet = {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  distributions: DistributionEntry[];
};

const FinancialReportsDetails: React.FC = () => {
  const { id } = useParams(); // Get outletId from route parameter
  const printRef = useRef<HTMLDivElement>(null); // Reference to the print container

  // Sample data (This would normally come from an API or database)
  const outlets: Outlet[] = [
    {
      id: "1",
      name: "Outlet A",
      address: "123 Main St",
      phoneNumber: "123-456-7890",
      distributions: [
        {
          invoiceCode: "INV-001",
          saleDate: "2024-12-01",
          productName: "Product A",
          batchName: "Batch A",
          quantity: "50",
          outletName: "Outlet A",
          outletId: "OUT001",
        },
      ],
    },
    {
      id: "2",
      name: "Outlet B",
      address: "456 Elm St",
      phoneNumber: "987-654-3210",
      distributions: [
        {
          invoiceCode: "INV-002",
          saleDate: "2024-12-02",
          productName: "Product B",
          batchName: "Batch B",
          quantity: "30",
          outletName: "Outlet B",
          outletId: "OUT002",
        },
        {
          invoiceCode: "INV-003",
          saleDate: "2024-12-03",
          productName: "Product C",
          batchName: "Batch C",
          quantity: "70",
          outletName: "Outlet B",
          outletId: "OUT002",
        },
      ],
    },
  ];

  // Find the outlet based on the outletId from URL params
  const selectedOutlet = outlets.find((outlet) => outlet.id === id);

  if (!selectedOutlet) {
    return <div>Outlet not found</div>;
  }

  // Function to handle printing of the invoice section
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && printRef.current) {
      printWindow.document.write(`
        <html>
          <head><title>Invoice</title></head>
          <body>
            <div>${printRef.current.innerHTML}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Outlet Details */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">{selectedOutlet.name}</h1>
        <p className="text-sm text-gray-600">{selectedOutlet.address}</p>
        <p className="text-sm text-gray-600">{selectedOutlet.phoneNumber}</p>
      </div>

      {/* Print Container with Distribution Details */}
      <div ref={printRef} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Distributions</h2>
          {/* Print Invoice Button */}
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Print Invoice
          </button>
        </div>

        {/* Table with Distribution Details */}
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Invoice Code</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Sale Date</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Batch Name</th>
              <th className="px-6 py-3 text-left text-sm text-gray-600">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {selectedOutlet.distributions.map((distribution, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">{distribution.invoiceCode}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{distribution.saleDate}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{distribution.batchName}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{distribution.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReportsDetails;
