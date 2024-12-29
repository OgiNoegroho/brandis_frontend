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

// Types
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
  // Redux
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const role = useAppSelector((state: RootState) => state.auth.role);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  // States
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [emptyBatches, setEmptyBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  // Form States
  const [batchName, setBatchName] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [productionDate, setProductionDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Access Control
  const onlyRole = role === "Pimpinan" || role === "Manajer";

  // Utility Functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const resetFormFields = () => {
    setBatchName("");
    setProductId("");
    setQuantity(0);
    setProductionDate("");
    setExpirationDate("");
  };

  // API Calls
  const fetchBatches = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/batch`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Data batch tidak dapat dimuat");

      const data = await response.json();
      setBatches(data);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal memuat data batch",
          isDarkMode,
        })
      );
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Data produk tidak dapat dimuat");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal memuat data produk",
          isDarkMode,
        })
      );
    }
  };

  const fetchEmptyBatches = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/batch/empty`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Data batch kosong tidak dapat dimuat");

      const data = await response.json();
      setEmptyBatches(data);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal memuat data batch kosong",
          isDarkMode,
        })
      );
    }
  };

  const fetchBatchDetails = async (batchId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/batch/${batchId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Detail batch tidak dapat dimuat");

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
      dispatch(
        showErrorToast({
          message: "Gagal memuat detail batch",
          isDarkMode,
        })
      );
    }
  };

  // CRUD Operations
  const addBatch = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/batch`,
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

      if (!response.ok) throw new Error("Gagal menambah batch");

      const newBatch = await response.json();
      setBatches([...batches, newBatch]);
      dispatch(
        showSuccessToast({ message: "Batch berhasil ditambahkan", isDarkMode })
      );
      fetchBatches();
      closeAddModal();
    } catch (error) {
      dispatch(
        showErrorToast({ message: "Gagal menambahkan batch", isDarkMode })
      );
    }
  };

  const updateBatch = async () => {
    if (!selectedBatch) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/batch/${selectedBatch.batch_id}`,
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

      if (!response.ok) throw new Error("Gagal memperbarui batch");

      const updatedBatch = await response.json();
      setBatches(
        batches.map((batch) =>
          batch.batch_id === selectedBatch.batch_id ? updatedBatch : batch
        )
      );
      dispatch(
        showSuccessToast({ message: "Batch berhasil diperbarui", isDarkMode })
      );
      fetchBatches();
      closeEditModal();
    } catch (error) {
      dispatch(
        showErrorToast({ message: "Gagal memperbarui batch", isDarkMode })
      );
    }
  };

  const confirmDeleteBatch = async () => {
    if (!batchToDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/batch/${batchToDelete.batch_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Gagal menghapus batch");

      setBatches(
        batches.filter((batch) => batch.batch_id !== batchToDelete.batch_id)
      );
      dispatch(
        showSuccessToast({ message: "Batch berhasil dihapus", isDarkMode })
      );
      fetchBatches();
      setShowDeleteModal(false);
    } catch (error) {
      dispatch(
        showErrorToast({ message: "Gagal menghapus batch", isDarkMode })
      );
    }
  };

  // Event Handlers
  const handleDeleteBatch = (batch: Batch) => {
    setBatchToDelete(batch);
    setShowDeleteModal(true);
  };

  const handleAddNewBatch = () => {
    resetFormFields();
    setShowAddModal(true);
  };

  const handleEditBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setBatchName(batch.nama_batch);
    setProductId(products.find((p) => p.nama === batch.nama_produk)?.id || "");
    setQuantity(batch.kuantitas);
    setExpirationDate(formatDate(batch.tanggal_kadaluarsa));
    setShowEditModal(true);
  };

  // Modal Handlers
  const closeAddModal = () => {
    setShowAddModal(false);
    resetFormFields();
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

  // Effects
  useEffect(() => {
    fetchBatches();
    fetchProducts();
    fetchEmptyBatches();
  }, [token]);

  return (
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Batch</h2>
        {onlyRole && (
          <Button
            className=""
            color="success"
            variant="flat"
            onPress={handleAddNewBatch}
          >
            Tambah Batch
          </Button>
        )}
      </div>

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
                  >
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.nama}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    label="Kuantitas"
                    value={String(quantity)}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <Input
                    type="date"
                    label="Tanggal Kedaluwarsa"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" variant="flat" onPress={addBatch}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                  >
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.nama}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    label="Kuantitas"
                    value={String(quantity)}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <Input
                    type="date"
                    label="Tanggal Kedaluwarsa"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Batal
                </Button>
                <Button color="primary" variant="flat" onPress={updateBatch}>
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Batch ID</span>
                    <span>{selectedBatch?.batch_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Nama Batch</span>
                    <span>{selectedBatch?.nama_batch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Nama Produk</span>
                    <span>{selectedBatch?.nama_produk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Tanggal Produksi</span>
                    <span>{selectedBatch?.dibuat_pada}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Tanggal Kedaluwarsa</span>
                    <span>{selectedBatch?.tanggal_kadaluarsa}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Kuantitas</span>
                    <span>{selectedBatch?.kuantitas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Terakhir Diperbarui</span>
                    <span>{selectedBatch?.diperbarui_pada}</span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
              <ModalBody>
                <p>
                  Apakah Anda yakin ingin menghapus batch{" "}
                  <strong>{batchToDelete?.nama_batch}</strong>?
                </p>
                <p className="text-red-500 italic">
                  <strong>Catatan:</strong> Batch yang telah digunakan dalam
                  proses produksi atau transaksi mungkin tidak dapat dihapus
                  untuk memastikan integritas data.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={confirmDeleteBatch}
                >
                  Hapus
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Active Batches Table */}
      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableColumn>No. Batch</TableColumn>
                <TableColumn>Nama Produk</TableColumn>
                <TableColumn>Kuantitas</TableColumn>
                <TableColumn>Tanggal Produksi</TableColumn>
                <TableColumn>Tanggal Kedaluwarsa</TableColumn>
                <TableColumn>Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.batch_id}>
                    <TableCell className="max-w-full sm:max-w-xs md:max-w-none truncate">
                      <div className="w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                        {batch.nama_batch}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-full sm:max-w-xs md:max-w-none truncate">
                      {/* Truncate text for mobile devices */}
                      <div className="w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                        {batch.nama_produk}
                      </div>
                    </TableCell>
                    <TableCell>{batch.kuantitas}</TableCell>
                    <TableCell>{formatDate(batch.dibuat_pada)}</TableCell>
                    <TableCell>
                      {formatDate(batch.tanggal_kadaluarsa)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={() => fetchBatchDetails(batch.batch_id)}
                        >
                          Detail
                        </Button>
                        {onlyRole && (
                          <>
                            <Button
                              color="warning"
                              variant="flat"
                              onPress={() => handleEditBatch(batch)}
                            >
                              Edit
                            </Button>
                            <Button
                              color="danger"
                              variant="flat"
                              onPress={() => handleDeleteBatch(batch)}
                            >
                              Hapus
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>

      {/* Empty Batches Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Batch Kosong</h2>
        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              <Table aria-label="Empty Batches Table">
                <TableHeader>
                  <TableColumn>No. Batch</TableColumn>
                  <TableColumn>Nama Produk</TableColumn>
                  <TableColumn>Tanggal Produksi</TableColumn>
                  <TableColumn>Tanggal Kedaluwarsa</TableColumn>
                  <TableColumn>Aksi</TableColumn>
                </TableHeader>
                <TableBody items={emptyBatches}>
                  {(batch) => (
                    <TableRow key={batch.batch_id}>
                      <TableCell className="max-w-full sm:max-w-xs md:max-w-none truncate">
                        <div className="w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                          {batch.nama_batch}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-full sm:max-w-xs md:max-w-none truncate">
                        <div className="w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                          {batch.nama_produk}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(batch.dibuat_pada)}</TableCell>
                      <TableCell>
                        {formatDate(batch.tanggal_kadaluarsa)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            color="primary"
                            variant="flat"
                            onPress={() => fetchBatchDetails(batch.batch_id)}
                          >
                            Detail
                          </Button>
                          {onlyRole && (
                            <Button
                              color="danger"
                              variant="flat"
                              onPress={() => handleDeleteBatch(batch)}
                            >
                              Hapus
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BatchManagement;
