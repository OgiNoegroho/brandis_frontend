"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  FaWarehouse,
  FaExclamationTriangle,
  FaPlusSquare,
  FaUndo,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { showErrorToast } from "@/redux/slices/toastSlice";

const DashboardManajer: React.FC = () => {
  const [gudangData, setGudangData] = useState<any[]>([]);
  const [totalStokGudang, setTotalStokGudang] = useState<number | null>(null);
  const [batchKadaluarsa, setBatchKadaluarsa] = useState<number | null>(null);
  const [batchDiproduksiBulanIni, setBatchDiproduksiBulanIni] = useState<
    number | null
  >(null);
  const [stokRendahGudang, setStokRendahGudang] = useState<any[]>([]);
  const [totalPengembalianProduk, setTotalPengembalianProduk] = useState<
    number | null
  >(null);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Total Stock in Warehouse
      const gudangRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/totalStokGudang`,
        { headers }
      );
      if (!gudangRes.ok) throw new Error("Gagal memuat data stok gudang.");
      const gudangData = await gudangRes.json();
      setGudangData(Array.isArray(gudangData) ? gudangData : []);

      // Fetch Summed-up Stock
      const stokGudangRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/totalStokGudang`,
        { headers }
      );
      if (!stokGudangRes.ok)
        throw new Error("Gagal memuat jumlah total stok gudang.");
      const stokGudangData = await stokGudangRes.json();
      setTotalStokGudang(stokGudangData[0]?.total_stock || 0);

      // Fetch Expiring Batches
      const kadaluarsaRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/batchKadaluarsa`,
        { headers }
      );
      if (!kadaluarsaRes.ok) throw new Error("Gagal memuat batch kadaluarsa.");
      const kadaluarsaData = await kadaluarsaRes.json();
      setBatchKadaluarsa(kadaluarsaData[0]?.total_batch_kadaluarsa || 0);

      // Fetch Batches Produced This Month
      const diproduksiRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manajer/batchDiproduksiBulanIni`,
        { headers }
      );
      if (!diproduksiRes.ok)
        throw new Error("Gagal memuat data batch diproduksi bulan ini.");
      const diproduksiData = await diproduksiRes.json();
      setBatchDiproduksiBulanIni(diproduksiData[0]?.batch_diproduksi || 0);

      // Fetch Low Stock Items
      const stokRendahRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manajer/stokRendahDiGudang`,
        { headers }
      );
      if (!stokRendahRes.ok) throw new Error("Gagal memuat stok rendah.");
      const stokRendahData = await stokRendahRes.json();
      setStokRendahGudang(Array.isArray(stokRendahData) ? stokRendahData : []);

      // Fetch Total Returned Products
      const pengembalianRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manajer/totalPengembalianProduk`,
        { headers }
      );
      if (!pengembalianRes.ok)
        throw new Error("Gagal memuat data produk yang dikembalikan.");
      const pengembalianData = await pengembalianRes.json();
      setTotalPengembalianProduk(
        pengembalianData[0]?.total_produk_dikembalikan || 0
      );
    } catch (err: any) {
      // Show error toast
      dispatch(
        showErrorToast({
          message: err.message || "Terjadi kesalahan saat memuat data.",
          isDarkMode: false,
        })
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="container px-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Manajer
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaWarehouse className="text-4xl text-blue-600 mb-2" />
            <h2 className="text-lg font-semibold">Total Stok Gudang</h2>
            <p className="text-xl font-bold">
              {totalStokGudang !== null ? totalStokGudang : "Loading..."}
            </p>
          </CardHeader>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaExclamationTriangle className="text-4xl text-red-500 mb-2" />
            <h2 className="text-lg font-semibold">Batch Kadaluarsa</h2>
            <p className="text-xl font-bold">
              {batchKadaluarsa !== null ? batchKadaluarsa : "Loading..."}
            </p>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaPlusSquare className="text-4xl text-green-500 mb-2" />
            <h2 className="text-lg font-semibold">
              Batch Diproduksi Bulan Ini
            </h2>
            <p className="text-xl font-bold">
              {batchDiproduksiBulanIni !== null
                ? batchDiproduksiBulanIni
                : "Loading..."}
            </p>
          </CardHeader>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaUndo className="text-4xl text-yellow-500 mb-2" />
            <h2 className="text-lg font-semibold">Total Pengembalian Produk</h2>
            <p className="text-xl font-bold">
              {totalPengembalianProduk !== null
                ? totalPengembalianProduk
                : "Loading..."}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="mt-8">
        <Card className="shadow-lg mb-8">
          <CardHeader className="flex items-center">
            <FaWarehouse className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Data Gudang</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Warehouse Data Table">
              <TableHeader>
                <TableColumn>Nama Barang</TableColumn>
                <TableColumn>Jumlah Stok</TableColumn>
              </TableHeader>
              <TableBody>
                {gudangData.length > 0 ? (
                  gudangData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.total_stock}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No data available</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaWarehouse className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Stok Rendah di Gudang</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Low stock table">
              <TableHeader>
                <TableColumn>Nama Produk</TableColumn>
                <TableColumn>Kuantitas</TableColumn>
              </TableHeader>
              <TableBody>
                {stokRendahGudang.length > 0 ? (
                  stokRendahGudang.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.kuantitas}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No data available</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardManajer;
