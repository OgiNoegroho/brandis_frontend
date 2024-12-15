"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks"; // Adjust the import based on your project's structure
import { RootState } from "@/redux/store"; // Adjust the import based on your project's structure
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


type Product = {
  produk_id: number; // Added product ID
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

  // Fetch token from Redux store
  const token = useAppSelector((state: RootState) => state.auth.token);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract only the 'YYYY-MM-DD' part
  };
  



  // Fetch inventory data from the backend
  useEffect(() => {
    const fetchInventory = async () => {
      if (!token) {
        console.error("No token available");
        return; // If no token, do not attempt to fetch data
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
        setProducts(data); // Update the state with fetched products
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, [token]); // Depend on `token`, so the effect runs again when it changes

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
      setBatchDetails(data); // Update the state with fetched batch details
    } catch (error) {
      console.error("Error fetching batch details:", error);
      setBatchDetails([]);
    } finally {
      setLoadingBatchDetails(false);
    }
  };

  const getStatus = (status: Product["ketersediaan"]) => {
    switch (status) {
      case "In stock":
        return <span className="text-green-600">In Stock</span>;
      case "Out of stock":
        return <span className="text-red-600">Out of Stock</span>;
      case "Low stock":
        return <span className="text-yellow-600">Low Stock</span>;
      default:
        return null;
    }
  };

  const handleDetailClick = async (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    await fetchInventoryDetail(product.produk_id); // Pass the correct product ID
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

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <Card className="shadow-lg">
          <CardBody>
            <div className="px-3">
              <h4 className="font-semibold">Total Produk</h4>
              <b>{products.length}</b>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody>
            <div className="px-3">
              <h4 className="font-semibold">Stok Rendah</h4>
              <b>
                {products.filter((p) => p.ketersediaan === "Low stock").length}
              </b>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody>
            <div className="px-3">
              <h4 className="font-semibold">Stok Habis</h4>
              <b>
                {products.filter((p) => p.ketersediaan === "Out of stock").length}
              </b>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="shadow-lg">
        <Table aria-label="Stock Management Table" className="bg-white rounded-lg">
          <TableHeader>
            <TableColumn>Nama produk</TableColumn>
            <TableColumn>kuantitas</TableColumn>
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
                    className="px-3 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-300"
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
      {isModalOpen && selectedProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">
          {selectedProduct.nama_produk}
        </h2>
      </div>
      <div className="p-6">
        {loadingBatchDetails ? (
          <p>Loading batch details...</p>
        ) : batchDetails.length > 0 ? (
          <ul>
            {batchDetails.map((batch, index) => (
              <li key={batch.batch_id} className="mb-4">
                <p>
                  <strong>Nama Bacth:</strong> {batch.nama_batch}
                </p>
                <p>
                  <strong>Kuantitas:</strong> {batch.kuantitas_batch}
                </p>
                <p>
                  <strong>Tanggal Produksi:</strong> {formatDate(batch.produksi_pada)}
                </p>
                <p>
                  <strong>Tanggal Kedaluwarsa:</strong> {formatDate(batch.tanggal_kadaluarsa)}
                </p>
                {/* Add a line separator between batches */}
                {index < batchDetails.length - 1 && <hr className="my-4" />}
              </li>
            ))}
          </ul>
        ) : (
          <p>No batch details available.</p>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default StockManagement;
