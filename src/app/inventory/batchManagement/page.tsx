"use client"

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
  Button,
} from "@nextui-org/react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice"; // Import the toast actions

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
  const dispatch = useAppDispatch(); // Use dispatch to dispatch actions

  // Redux selector for token
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
        (state: RootState) => state.global.isDarkMode
      ); 

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
      const response = await fetch(
        "http://localhost:3008/api/inventory/batch",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch batches");

      const data = await response.json();
      setBatches(data);
      dispatch(
        showSuccessToast({
          message: "Batches loaded successfully",
          isDarkMode,
        })
      );
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({ message: "Failed to load batches", isDarkMode })
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3008/api/products", {
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
      dispatch(
        showErrorToast({
          message: "Failed to load products",
          isDarkMode,
        })
      );
    }
  };

  // Add a new batch
  const addBatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:3008/api/inventory/batch",
        {
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
        }
      );

      if (!response.ok) throw new Error("Failed to add batch");

      const newBatch = await response.json();
      setBatches([...batches, newBatch]);
      dispatch(
        showSuccessToast({
          message: "Batch added successfully",
          isDarkMode,
        })
      );
      closeAddModal();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({ message: "Failed to add batch", isDarkMode })
      );
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
      const response = await fetch(
        `http://localhost:3008/api/inventory/batch/${selectedBatch.batch_id}`,
        {
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
        }
      );

      if (!response.ok) throw new Error("Failed to update batch");

      const updatedBatch = await response.json();
      setBatches(
        batches.map((batch) =>
          batch.batch_id === selectedBatch.batch_id ? updatedBatch : batch
        )
      );
      dispatch(
        showSuccessToast({
          message: "Batch updated successfully",
          isDarkMode,
        })
      );
      closeEditModal();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({ message: "Failed to update batch", isDarkMode })
      );
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
        const response = await fetch(
          `http://localhost:3008/api/inventory/batch/${batchId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete batch");

        setBatches(batches.filter((batch) => batch.batch_id !== batchId));
        dispatch(
          showSuccessToast({
            message: "Batch deleted successfully",
            isDarkMode,
          })
        );
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        dispatch(
          showErrorToast({
            message: "Failed to delete batch",
            isDarkMode,
          })
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchBatchDetails = async (batchId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3008/api/inventory/batch/${batchId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({
          message: "Failed to fetch batch details",
          isDarkMode,
        })
      );
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
    <div className="p-12 sm:p-8 bg-gray-50 min-h-screen">
      {/* Error Handling */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Manajemen Batch</h2>

      {/* Add Product Button */}
      <div className="flex justify-end mb-6">
        <Button
          className=""
          color="success"
          variant="flat"
          onClick={handleAddNewBatch}
          disabled={loading}
        >
          Tambah Batch
        </Button>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Tambah Batch</h3>
            <div className="space-y-4">
              {/* Removed Nama Batch input */}
              <label className="text-sm">Produk</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              >
                <option value="">Pilih Produk</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nama}
                  </option>
                ))}
              </select>
              <label className="text-sm">Tanggal Produksi</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              />
              <label className="text-sm">Kuantitas</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              />
              <label className="text-sm">Tanggal Kedaluwarsa</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              />
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  className=""
                  color="danger"
                  variant="flat"
                  onClick={closeAddModal}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  className=""
                  color="primary"
                  variant="flat"
                  onClick={addBatch}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Simpan"}
                </Button>
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
              {/* Removed Nama Batch input */}
              <label className="text-sm">Produk</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              >
                <option value="">Pilih Produk</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nama}
                  </option>
                ))}
              </select>
              <label className="text-sm">Tanggal Produksi</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              />
              <label className="text-sm">Kuantitas</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              />
              <label className="text-sm">Tanggal Kedaluwarsa</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="border rounded-lg p-2 w-full"
                disabled={loading}
              />
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  className=""
                  color="danger"
                  variant="flat"
                  onClick={closeEditModal}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  className=""
                  color="primary"
                  variant="flat"
                  onClick={updateBatch}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Simpan"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedBatch && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h3 className="text-xl font-semibold mb-6"> Detail Batch</h3>
            <div className="w-full">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Batch ID</td>
                    <td className="px-4 py-2">{selectedBatch.batch_id}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Nama Batch</td>
                    <td className="px-4 py-2">{selectedBatch.nama_batch}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Nama Produk</td>
                    <td className="px-4 py-2">{selectedBatch.nama_produk}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">
                      Tanggal Produksi
                    </td>
                    <td className="px-4 py-2">{selectedBatch.dibuat_pada}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">
                      Tanggal Kedaluwarsa
                    </td>
                    <td className="px-4 py-2">
                      {selectedBatch.tanggal_kadaluarsa}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Kuantitas</td>
                    <td className="px-4 py-2">{selectedBatch.kuantitas}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">
                      Terakhir Diperbarui
                    </td>
                    <td className="px-4 py-2">
                      {selectedBatch.diperbarui_pada}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 flex justify-end">
                <Button
                  className=""
                  color="primary"
                  variant="flat"
                  onClick={closeDetailModal}
                >
                  Selesai
                </Button>
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
                  <TableColumn>Nama Batch</TableColumn>
                  <TableColumn>Nama Produk</TableColumn>
                  <TableColumn>Kuantitas</TableColumn>
                  <TableColumn>Tanggal Produksi</TableColumn>
                  <TableColumn>Tanggal Kedaluwarsa</TableColumn>
                  <TableColumn>Aksi</TableColumn>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.batch_id}>
                      <TableCell>{batch.nama_batch}</TableCell>
                      <TableCell>{batch.nama_produk}</TableCell>
                      <TableCell>{batch.kuantitas}</TableCell>
                      <TableCell>{formatDate(batch.dibuat_pada)}</TableCell>
                      <TableCell>
                        {formatDate(batch.tanggal_kadaluarsa)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            className=""
                            color="primary"
                            variant="flat"
                            onClick={() => fetchBatchDetails(batch.batch_id)}
                            disabled={loading}
                          >
                            Detail
                          </Button>
                          <Button
                            className=""
                            color="warning"
                            variant="flat"
                            onClick={() => handleEditBatch(batch)}
                            disabled={loading}
                          >
                            Edit
                          </Button>
                          <Button
                            className=""
                            color="danger"
                            variant="flat"
                            onClick={() => deleteBatch(batch.batch_id)}
                            disabled={loading}
                          >
                            Hapus
                          </Button>
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
