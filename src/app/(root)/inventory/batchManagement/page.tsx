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
  Divider,
  Input,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";

// Type Definitions
type Batch = {
  batch_id: number;
  nama_batch: string;
  nama_produk: string;
  dibuat_pada: string;
  tanggal_kadaluarsa: string;
  kuantitas: number;
  diperbarui_pada: string;
};

type Product = {
  id: string;
  nama: string;
};

const BatchManagement: React.FC = () => {
  const dispatch = useAppDispatch();
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
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
        showErrorToast({ message: "Failed to load products", isDarkMode })
      );
    }
  };

  // Add Batch and Edit Batch Modal Handlers

  // Add the batch after successful creation
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
      setBatches([...batches, newBatch]); // Update state with new batch
      dispatch(
        showSuccessToast({ message: "Batch berhasil ditambahkan", isDarkMode })
      );
      fetchBatches(); // Refresh the table with the latest data
      closeAddModal();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({ message: "Gagal menambahkan batch", isDarkMode })
      );
    } finally {
      setLoading(false);
    }
  };

  // Update the batch after successful edit
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
        showSuccessToast({ message: "Batch berhasil diperbarui", isDarkMode })
      );
      fetchBatches(); // Refresh the table with updated data
      closeEditModal();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({ message: "Gagal memperbarui batch", isDarkMode })
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle the deletion process
  const handleDeleteBatch = (batch: Batch) => {
    setBatchToDelete(batch);
    setShowDeleteModal(true);
  };

  const confirmDeleteBatch = async () => {
    if (!batchToDelete) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3008/api/inventory/batch/${batchToDelete.batch_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete batch");

      setBatches(
        batches.filter((batch) => batch.batch_id !== batchToDelete.batch_id)
      );
      dispatch(
        showSuccessToast({ message: "Batch berhasil dihapus", isDarkMode })
      );
      fetchBatches(); // Refresh the table after deletion
      setShowDeleteModal(false); // Close the delete modal
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({ message: "Gagal menghapus batch", isDarkMode })
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Batch Details
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

      const [data] = await response.json();
      setSelectedBatch({
        batch_id: data.batch_id,
        nama_batch: data.nama_batch,
        nama_produk: data.nama_produk,
        kuantitas: data.kuantitas_batch,
        dibuat_pada: formatDate(data.dibuat_pada),
        tanggal_kadaluarsa: formatDate(data.tanggal_kadaluarsa),
        diperbarui_pada: formatDate(data.diperbarui_pada),
      });
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      dispatch(
        showErrorToast({ message: "Gagal mengambil detail batch", isDarkMode })
      );
    } finally {
      setLoading(false);
    }
  };

  // Modal Handlers and Utility Functions
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
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchBatches();
    fetchProducts();
  }, [token]);

  return (
    <div className="p-12 sm:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Batch</h2>
        <Button
          className=""
          color="success"
          variant="flat"
          onPress={handleAddNewBatch}
          disabled={loading}
        >
          Tambah Batch
        </Button>
      </div>
      {/* Add Batch Modal */}
      <Modal isOpen={showAddModal} onClose={closeAddModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tambah Batch
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select
                    label="Produk"
                    placeholder="Pilih Produk"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    isDisabled={loading}
                  >
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.nama}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="date"
                    label="Tanggal Produksi"
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                    isDisabled={loading}
                  />
                  <Input
                    type="number"
                    label="Kuantitas"
                    value={String(quantity)}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    isDisabled={loading}
                  />
                  <Input
                    type="date"
                    label="Tanggal Kedaluwarsa"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    isDisabled={loading}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={loading}
                >
                  Batal
                </Button>
                <Button color="primary" onPress={addBatch} isDisabled={loading}>
                  {loading ? "Saving..." : "Simpan"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Edit Batch Modal */}
      <Modal isOpen={showEditModal && !!selectedBatch} onClose={closeEditModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Batch
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select
                    label="Produk"
                    placeholder="Pilih Produk"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    isDisabled={loading}
                  >
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.nama}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="date"
                    label="Tanggal Produksi"
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                    isDisabled={loading}
                  />
                  <Input
                    type="number"
                    label="Kuantitas"
                    value={String(quantity)}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    isDisabled={loading}
                  />
                  <Input
                    type="date"
                    label="Tanggal Kedaluwarsa"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    isDisabled={loading}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={loading}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  onPress={updateBatch}
                  isDisabled={loading}
                >
                  {loading ? "Updating..." : "Simpan"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Detail Batch Modal */}
      <Modal
        isOpen={showDetailModal && !!selectedBatch}
        onClose={closeDetailModal}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail Batch
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Batch details table">
                  <TableHeader>
                    <TableColumn>Field</TableColumn>
                    <TableColumn>Value</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">Batch ID</TableCell>
                      <TableCell>{selectedBatch?.batch_id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Nama Batch
                      </TableCell>
                      <TableCell>{selectedBatch?.nama_batch}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Nama Produk
                      </TableCell>
                      <TableCell>{selectedBatch?.nama_produk}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Tanggal Produksi
                      </TableCell>
                      <TableCell>{selectedBatch?.dibuat_pada}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Tanggal Kedaluwarsa
                      </TableCell>
                      <TableCell>{selectedBatch?.tanggal_kadaluarsa}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">Kuantitas</TableCell>
                      <TableCell>{selectedBatch?.kuantitas}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        Terakhir Diperbarui
                      </TableCell>
                      <TableCell>{selectedBatch?.diperbarui_pada}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Selesai
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Batch Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalContent>
          <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus batch{" "}
              <strong>{batchToDelete?.nama_batch}</strong>?
            </p>
            <p style={{ color: "red", fontStyle: "italic" }}>
              <strong>Catatan:</strong> Batch yang telah digunakan dalam proses
              produksi atau transaksi mungkin tidak dapat dihapus untuk
              memastikan integritas data.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={() => setShowDeleteModal(false)}
              isDisabled={loading}
            >
              Batal
            </Button>
            <Button
              color="danger"
              variant="flat"
              onPress={confirmDeleteBatch}
              isDisabled={loading}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
                            onPress={() => fetchBatchDetails(batch.batch_id)}
                            disabled={loading}
                          >
                            Detail
                          </Button>
                          <Button
                            className=""
                            color="warning"
                            variant="flat"
                            onPress={() => handleEditBatch(batch)}
                            disabled={loading}
                          >
                            Edit
                          </Button>
                          <Button
                            className=""
                            color="danger"
                            variant="flat"
                            onPress={() => handleDeleteBatch(batch)}
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
