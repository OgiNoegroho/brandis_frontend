"use client";

import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showErrorToast } from "@/redux/slices/toastSlice";
import {
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Divider,
} from "@nextui-org/react";

// Types
type Product = {
  produk_id: number;
  nama_produk: string;
  kuantitas: number;
  ketersediaan: "Stok Tersedia" | "Stok Menipis" | "Stok Habis";
};

type BatchDetail = {
  batch_id: number;
  nama_batch: string;
  kuantitas_batch: number;
  tanggal_kadaluarsa: string;
  produksi_pada: string;
};

const StockManagement: React.FC = () => {
  // Redux
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  // States
  const [products, setProducts] = useState<Product[]>([]);
  const [batchDetails, setBatchDetails] = useState<BatchDetail[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingBatchDetails, setLoadingBatchDetails] = useState(false);

  // Utility Functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getStatus = (status: Product["ketersediaan"]) => {
    switch (status) {
      case "Stok Tersedia":
        return (
          <Chip
            color="success"
            variant="flat"
            className="capitalize text-green-500 bg-green-50"
          >
            Stok Tersedia
          </Chip>
        );
      case "Stok Habis":
        return (
          <Chip
            color="danger"
            variant="flat"
            className="capitalize text-red-500 bg-red-50"
          >
            Stok Habis
          </Chip>
        );
      case "Stok Menipis":
        return (
          <Chip
            color="warning"
            variant="flat"
            className="capitalize text-yellow-500 bg-yellow-50"
          >
            Stok Menipis
          </Chip>
        );
      default:
        return null;
    }
  };

  // API Calls
  const fetchInventory = async () => {
    if (!token) {
      console.error("Token tidak tersedia");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data inventori");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error mengambil inventori:", error);
      dispatch(
        showErrorToast({
          message: "Gagal memuat data inventori",
          isDarkMode,
        })
      );
    }
  };

  const fetchInventoryDetail = async (produkId: number) => {
    if (!token) {
      console.error("Token tidak tersedia");
      return;
    }

    setLoadingBatchDetails(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/${produkId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil detail batch");
      }

      const data = await response.json();
      setBatchDetails(data);
    } catch (error) {
      console.error("Error mengambil detail batch:", error);
      dispatch(
        showErrorToast({
          message: "Gagal memuat detail batch",
          isDarkMode,
        })
      );
      setBatchDetails([]);
    } finally {
      setLoadingBatchDetails(false);
    }
  };

  // Event Handlers
  const handleDetailClick = async (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    await fetchInventoryDetail(product.produk_id);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    setBatchDetails([]);
  };

  // Effects
  useEffect(() => {
    fetchInventory();
  }, [token]);

  return (
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Manajemen Stok</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <Card className="shadow-lg">
          <CardBody>
            <h4 className="font-semibold">Total Produk</h4>
            <b>{products.length}</b>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody>
            <h4 className="font-semibold">Stok Rendah</h4>
            <b>
              {products.filter((p) => p.ketersediaan === "Stok Menipis").length}
            </b>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody>
            <h4 className="font-semibold">Stok Habis</h4>
            <b>
              {products.filter((p) => p.ketersediaan === "Stok Habis").length}
            </b>
          </CardBody>
        </Card>
      </div>

      <Card className="shadow-lg">
        <Table
          aria-label="Stock Management Table"
          className="bg-white rounded-lg"
        >
          <TableHeader>
            <TableColumn>Nama produk</TableColumn>
            <TableColumn>Kuantitas</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Aksi</TableColumn>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.produk_id}>
                <TableCell className="max-w-full sm:max-w-xs md:max-w-none truncate">
                  <div className="w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.nama_produk}
                  </div>
                </TableCell>
                <TableCell className="max-w-full sm:max-w-xs md:max-w-none truncate">
                  <div className="w-full sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.kuantitas} Packets
                  </div>
                </TableCell>
                <TableCell>{getStatus(product.ketersediaan)}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDetailClick(product)}
                    color="primary"
                    variant="flat"
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        scrollBehavior="inside"
        placement="center"
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedProduct
                  ? selectedProduct.nama_produk
                  : "Detail Produk"}
              </ModalHeader>
              <ModalBody>
                {loadingBatchDetails ? (
                  <p>Loading batch details...</p>
                ) : batchDetails.length > 0 ? (
                  <ul>
                    {batchDetails.map((batch) => (
                      <li key={batch.batch_id} className="mb-4">
                        <p>
                          <strong>No Batch:</strong> {batch.nama_batch}
                        </p>
                        <p>
                          <strong>Kuantitas:</strong> {batch.kuantitas_batch}
                        </p>
                        <p>
                          <strong>Tanggal Produksi:</strong>{" "}
                          {formatDate(batch.produksi_pada)}
                        </p>
                        <p>
                          <strong>Tanggal Kedaluwarsa:</strong>{" "}
                          {formatDate(batch.tanggal_kadaluarsa)}
                        </p>
                        <Divider className="my-4" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No batch details available.</p>
                )}
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
    </div>
  );
};

export default StockManagement;
