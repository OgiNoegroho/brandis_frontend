"use client";

import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showErrorToast } from "@/redux/slices/toastSlice"; // Import the action
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

type Product = {
  produk_id: number;
  nama_produk: string;
  kuantitas: number;
  ketersediaan: "In stock" | "Low stock" | "Out of stock";
};

type BatchDetail = {
  batch_id: number;
  nama_batch: string;
  kuantitas_batch: number;
  tanggal_kadaluarsa: string;
  produksi_pada: string;
};

const StockManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [batchDetails, setBatchDetails] = useState<BatchDetail[]>([]);
  const [loadingBatchDetails, setLoadingBatchDetails] = useState(false);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );
  const dispatch = useAppDispatch(); // Initialize dispatch

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchInventory = async () => {
      if (!token) {
        console.error("No token available");
        return;
      }

      try {
        const response = await fetch("http://localhost:3008/api/inventory", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Inventory.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        dispatch(
          showErrorToast({ message: "Failed to load inventory.", isDarkMode })
        ); // Show error toast
      }
    };

    fetchInventory();
  }, [token, dispatch, isDarkMode]);

  const fetchInventoryDetail = async (produkId: number) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    setLoadingBatchDetails(true);

    try {
      const response = await fetch(
        `http://localhost:3008/api/inventory/${produkId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch batch details.");
      }

      const data = await response.json();
      setBatchDetails(data);
    } catch (error) {
      console.error("Error fetching batch details:", error);
      dispatch(
        showErrorToast({ message: "Failed to load batch details.", isDarkMode })
      ); // Show error toast
      setBatchDetails([]);
    } finally {
      setLoadingBatchDetails(false);
    }
  };

  const getStatus = (status: Product["ketersediaan"]) => {
    switch (status) {
      case "In stock":
        return (
          <Chip
            color="success"
            variant="flat"
            className="capitalize text-green-500 bg-green-50"
          >
            In Stock
          </Chip>
        );
      case "Out of stock":
        return (
          <Chip
            color="danger"
            variant="flat"
            className="capitalize text-red-500 bg-red-50"
          >
            Out of Stock
          </Chip>
        );
      case "Low stock":
        return (
          <Chip
            color="warning"
            variant="flat"
            className="capitalize text-yellow-500 bg-yellow-50"
          >
            Low Stock
          </Chip>
        );
      default:
        return null;
    }
  };

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

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
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
              {products.filter((p) => p.ketersediaan === "Low stock").length}
            </b>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody>
            <h4 className="font-semibold">Stok Habis</h4>
            <b>
              {products.filter((p) => p.ketersediaan === "Out of stock").length}
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
                <TableCell>{product.nama_produk}</TableCell>
                <TableCell>{product.kuantitas} Packets</TableCell>
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        scrollBehavior="inside" // Ensures scrollable content inside the modal
        placement="center" // Centers the modal
        onOpenChange={(open) => {
          if (!open) closeModal(); // Close modal when the state changes
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
                          <strong>Nama Batch:</strong> {batch.nama_batch}
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
