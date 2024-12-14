"use client";

import React, { useState, useEffect } from "react";
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
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

// Type Definitions
type Batch = {
  batch_id: number;
  nama_batch: string;
  nama_produk: string;
  dibuat_pada: string;
  tanggal_kadaluarsa: string;
  kuantitas: number;
  diperbarui_pada: string; // Added this field
};

type Product = {
  id: string;
  nama: string;
};

const BatchManagement: React.FC = () => {
  // Redux selector for token
  const token = useAppSelector((state: RootState) => state.auth.token);


 
  

  // State Management
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [batchName, setBatchName] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [productionDate, setProductionDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  // Fetch Batches
  const fetchBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://brandis-backend.vercel.app/api/inventory/batch", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch batches");
      
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch("https://brandis-backend.vercel.app/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Add a new batch
  const addBatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://brandis-backend.vercel.app/api/inventory/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: batchName,
          produk_id: productId,
          kuantitas: quantity,
          tanggal_kadaluarsa: expirationDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to add batch");

      const newBatch = await response.json();
      setBatches([...batches, newBatch]);
      closeAddModal();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Update Batch
  const updateBatch = async () => {
    if (!selectedBatch) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://brandis-backend.vercel.app/api/inventory/batch/${selectedBatch.batch_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: batchName,
          produk_id: productId,
          kuantitas: quantity,
          tanggal_kadaluarsa: expirationDate,
        }),
      });

      if (!response.ok) throw new Error("Failed to update batch");

      const updatedBatch = await response.json();
      setBatches(batches.map(batch => 
        batch.batch_id === selectedBatch.batch_id ? updatedBatch : batch
      ));
      closeEditModal();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Delete Batch
  const deleteBatch = async (batchId: number) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://brandis-backend.vercel.app/api/inventory/batch/${batchId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to delete batch");

        setBatches(batches.filter(batch => batch.batch_id !== batchId));
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchBatchDetails = async (batchId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://brandis-backend.vercel.app/api/inventory/batch/${batchId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch batch details");
  
      const [data] = await response.json(); // Assuming the API returns an array
      setSelectedBatch({
        batch_id: data.batch_id,
        nama_batch: data.nama_batch,
        nama_produk: data.nama_produk,
        kuantitas: data.kuantitas_batch,
        dibuat_pada: formatDate(data.dibuat_pada),
        tanggal_kadaluarsa: formatDate(data.tanggal_kadaluarsa),
        diperbarui_pada: formatDate(data.diperbarui_pada), // Processed here
      });
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  // Modal Handlers
  const handleAddNewBatch = () => {
    resetFormFields();
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    resetFormFields();
  };

  const handleEditBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setBatchName(batch.nama_batch);
    setProductId(products.find((p) => p.nama === batch.nama_produk)?.id || "");
    setQuantity(batch.kuantitas);
    setProductionDate(formatDate(batch.dibuat_pada));
    setExpirationDate(formatDate(batch.tanggal_kadaluarsa));
    setShowEditModal(true);
  };
  

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedBatch(null);
    resetFormFields();
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedBatch(null);
  };

  const resetFormFields = () => {
    setBatchName("");
    setProductId("");
    setQuantity(0);
    setProductionDate("");
    setExpirationDate("");
  };


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract only the 'YYYY-MM-DD' part
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBatches();
    fetchProducts();
  }, [token]);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold">Batch Management</h1>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleAddNewBatch}
          disabled={loading}
        >
          Add New Batch
        </button>
      </div>

  {/* Add Batch Modal */}
{showAddModal && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-semibold mb-4">Add New Batch</h3>
      <div className="space-y-4">
        <label className="text-sm">Batch Name</label>
        <input
          type="text"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <label className="text-sm">Product</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nama}
            </option>
          ))}
        </select>
        <label className="text-sm">Production Date</label>
        <input
          type="date"
          value={productionDate}
          onChange={(e) => setProductionDate(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <label className="text-sm">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <label className="text-sm">Expiration Date</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg"
            onClick={closeAddModal}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={addBatch}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}



    {/* Edit Batch Modal */}
{showEditModal && selectedBatch && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-semibold mb-4">Edit Batch</h3>
      <div className="space-y-4">
        <label className="text-sm">Batch Name</label>
        <input
          type="text"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <label className="text-sm">Product</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nama}
            </option>
          ))}
        </select>
        <label className="text-sm">Production Date</label>
        <input
          type="date"
          value={productionDate}
          onChange={(e) => setProductionDate(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <label className="text-sm">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <label className="text-sm">Expiration Date</label>
        <input
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="border rounded-lg p-2 w-full"
          disabled={loading}
        />
        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg"
            onClick={closeEditModal}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={updateBatch}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}



{showDetailModal && selectedBatch && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[500px]">
      <h3 className="text-xl font-semibold mb-6">Batch Details</h3>
      <div className="w-full">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="px-4 py-2 font-semibold">Batch ID</td>
              <td className="px-4 py-2">{selectedBatch.batch_id}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Batch Name</td>
              <td className="px-4 py-2">{selectedBatch.nama_batch}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Product Name</td>
              <td className="px-4 py-2">{selectedBatch.nama_produk}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Production Date</td>
              <td className="px-4 py-2">{selectedBatch.dibuat_pada}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Expiration Date</td>
              <td className="px-4 py-2">{selectedBatch.tanggal_kadaluarsa}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Quantity</td>
              <td className="px-4 py-2">{selectedBatch.kuantitas}</td>
            </tr>
             <tr>
              <td className="px-4 py-2 font-semibold">Last Updated</td>
              <td className="px-4 py-2">{selectedBatch.diperbarui_pada}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={closeDetailModal}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
)}




      {/* Batch Table */}
      <Card>
        <CardBody>
          {loading ? (
            <div className="text-center py-4">Loading batches...</div>
          ) : batches.length === 0 ? (
            <div className="text-center py-4">No batches found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableColumn>Batch Name</TableColumn>
                  <TableColumn>Product Name</TableColumn>
                  <TableColumn>Quantity</TableColumn>
                  <TableColumn>Production Date</TableColumn>
                  <TableColumn>Expiration Date</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
  {batches.map((batch) => (
    <TableRow key={batch.batch_id}>
      <TableCell>{batch.nama_batch}</TableCell>
      <TableCell>{batch.nama_produk}</TableCell>
      <TableCell>{batch.kuantitas}</TableCell>
      <TableCell>{formatDate(batch.dibuat_pada)}</TableCell>
      <TableCell>{formatDate(batch.tanggal_kadaluarsa)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-lg"
            onClick={() => fetchBatchDetails(batch.batch_id)}
            disabled={loading}
          >
            Details
          </button>
          <button
            className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
            onClick={() => handleEditBatch(batch)}
            disabled={loading}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded-lg"
            onClick={() => deleteBatch(batch.batch_id)}
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

              </Table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default BatchManagement;