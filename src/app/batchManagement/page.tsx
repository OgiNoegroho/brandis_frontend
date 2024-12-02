"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

// Type Definitions
type Batch = {
  id: number;
  name: string;
  productionDate: string;
  expirationDate: string;
  quantity: number;
};

// Sample batch data
const batches: Batch[] = [
  { id: 1, name: "Batch 1", productionDate: "2024/03/05", expirationDate: "2025/03/05", quantity: 10 },
  { id: 2, name: "Batch 2", productionDate: "2024/03/05", expirationDate: "2025/03/05", quantity: 20 },
  { id: 3, name: "Batch 3", productionDate: "2024/03/05", expirationDate: "2025/03/05", quantity: 35 },
];

const BatchManagement: React.FC = () => {
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // State for New Batch
  const [batchName, setBatchName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [productionDate, setProductionDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  // Handle Modal for Add New Batch
  const handleAddNewBatch = () => {
    setBatchName("");
    setQuantity(0);
    setProductionDate("");
    setExpirationDate("");
    setShowBatchForm(true);
  };

  const closeBatchForm = () => {
    setShowBatchForm(false);
  };

  // Handle Detail Modal
  const handleShowDetail = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedBatch(null);
    setShowDetailModal(false);
  };

  // Handle Edit Modal
  const handleEditBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setBatchName(batch.name);
    setQuantity(batch.quantity);
    setProductionDate(batch.productionDate);
    setExpirationDate(batch.expirationDate);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedBatch(null);
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = () => {
    console.log("Updated batch:", {
      id: selectedBatch?.id,
      name: batchName,
      quantity,
      productionDate,
      expirationDate,
    });
    closeEditModal();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Batch Management</h1>
        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          onClick={handleAddNewBatch}
        >
          Add New Batch
        </button>
      </div>

      {/* Add New Batch Modal */}
      {showBatchForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Batch</h3>
            <div className="flex flex-col space-y-4">
              <label className="text-sm">Batch Name</label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              />
              <label className="text-sm">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2"
              />
              <label className="text-sm">Production Date</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              />
              <label className="text-sm">Expiration Date</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                onClick={closeBatchForm}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => console.log("Batch added:", { batchName, quantity, productionDate, expirationDate })}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updated Detail Modal */}
      {showDetailModal && selectedBatch && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h3 className="text-xl font-semibold mb-6">Batch Details For Product A</h3>
            
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Batch Name</th>
                    <th className="text-left py-2">Quantity</th>
                    <th className="text-left py-2">Production Date</th>
                    <th className="text-left py-2">Expiration Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">{selectedBatch.name}</td>
                    <td className="py-3">{selectedBatch.quantity}</td>
                    <td className="py-3">{selectedBatch.productionDate}</td>
                    <td className="py-3">{selectedBatch.expirationDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                onClick={closeDetailModal}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Batch</h3>
            <div className="flex flex-col space-y-4">
              <label className="text-sm">Batch Name</label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              />
              <label className="text-sm">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2"
              />
              <label className="text-sm">Production Date</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              />
              <label className="text-sm">Expiration Date</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Table */}
      <Card>
        <CardBody>
          <Table aria-label="Batch List Table">
            <TableHeader>
              <TableColumn>Batch ID</TableColumn>
              <TableColumn>Batch Name</TableColumn>
              <TableColumn>Production Date</TableColumn>
              <TableColumn>Expiration Date</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.id}</TableCell>
                  <TableCell>{batch.name}</TableCell>
                  <TableCell>{batch.productionDate}</TableCell>
                  <TableCell>{batch.expirationDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => handleShowDetail(batch)}
                      >
                        Detail
                      </button>
                      <button
                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                        onClick={() => handleEditBatch(batch)}
                      >
                        Edit
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default BatchManagement;