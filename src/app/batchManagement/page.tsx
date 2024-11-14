"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react"; // Import Next UI components

type Batch = {
  id: number;
  name: string;
  productionDate: string;
  expirationDate: string;
};

const batches: Batch[] = [
  { id: 1, name: "Batch 001", productionDate: "2024-01-10", expirationDate: "2025-01-10" },
  { id: 2, name: "Batch 002", productionDate: "2024-02-15", expirationDate: "2025-02-15" },
  { id: 3, name: "Batch 003", productionDate: "2024-03-20", expirationDate: "2025-03-20" },
];

const products = [
  { id: 1, name: "Product A" },
  { id: 2, name: "Product B" },
  { id: 3, name: "Product C" },
];

const BatchManagement: React.FC = () => {
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showAddProductsForm, setShowAddProductsForm] = useState(false);
  const [batchName, setBatchName] = useState("");
  const [productionDate, setProductionDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);

  const handleAddNewBatch = () => setShowBatchForm(true);
  const handleSaveBatch = () => {
    console.log("Batch created:", { batchName, productionDate, expirationDate });
    setShowBatchForm(false);
  };

  const handleAddProductToBatch = () => {
    console.log(`Added ${selectedProduct} with quantity ${quantity} to batch ${selectedBatchId}`);
    setShowAddProductsForm(false);
  };

  const closeBatchForm = () => {
    setShowBatchForm(false);
    setBatchName("");
    setProductionDate(null);
    setExpirationDate(null);
  };

  const closeAddProductsForm = () => {
    setShowAddProductsForm(false);
    setSelectedProduct(null);
    setQuantity(0);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Batch Management</h1>
        <Button variant="flat" color="primary" onClick={handleAddNewBatch}>
          <Plus className="w-4 h-4 mr-2" />
          New Batch
        </Button>
      </div>

      {/* Batch Creation Form Modal */}
      {showBatchForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Batch</h3>
            <div className="flex flex-col space-y-4">
              <label htmlFor="batchName" className="text-sm">Batch Name</label>
              <input
                id="batchName"
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
                required
              />

              <label htmlFor="productionDate" className="text-sm">Production Date</label>
              <input
                id="productionDate"
                type="date"
                value={productionDate?.toISOString().split("T")[0] || ""}
                onChange={(e) => setProductionDate(new Date(e.target.value))}
                className="border border-gray-300 rounded-lg p-2"
                required
              />

              <label htmlFor="expirationDate" className="text-sm">Expiration Date</label>
              <input
                id="expirationDate"
                type="date"
                value={expirationDate?.toISOString().split("T")[0] || ""}
                onChange={(e) => setExpirationDate(new Date(e.target.value))}
                className="border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg" onClick={closeBatchForm}>
                Cancel
              </button>
              <Button color="primary" onClick={handleSaveBatch}>
                Save and Add Products
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Products to Batch Form Modal */}
      {showAddProductsForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Products to Batch {selectedBatchId}</h3>
            <div className="flex flex-col space-y-4">
              <label htmlFor="selectProduct" className="text-sm">Select Product</label>
              <select
                id="selectProduct"
                value={selectedProduct || ""}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="border border-gray-300 rounded-lg p-2"
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={String(product.id)}>
                    {product.name}
                  </option>
                ))}
              </select>

              <label htmlFor="quantity" className="text-sm">Quantity</label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg" onClick={closeAddProductsForm}>
                Cancel
              </button>
              <Button color="primary" onClick={handleAddProductToBatch}>
                Add Product
              </Button>
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
                      <Button variant="flat" color="primary">
                        Detail
                      </Button>
                      <Button variant="flat"
                        color="primary"
                      
                        onClick={() => {
                          setSelectedBatchId(batch.id);
                          setShowAddProductsForm(true);
                        }}
                      >
                        Edit
                      </Button>
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
