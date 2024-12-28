"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  FaWarehouse,
  FaExclamationTriangle,
  FaPlusSquare,
  FaUndo,
  FaCalendarAlt,
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
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { showErrorToast } from "@/redux/slices/toastSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface GudangData {
  product_name: string;
  total_stock: number;
}

interface StokRendah {
  nama: string;
  kuantitas: number;
}

interface BatchKadaluarsa {
  product_name: string;
  expiry_date: string;
}

interface ProduksiData {
  product_name: string;
  quantity: number;
}

interface PengembalianData {
  product_name: string;
  outlet_name: string;
  quantity: number;
}

const DashboardManajer: React.FC = () => {
  const [gudangData, setGudangData] = useState<GudangData[]>([]);
  
  const [batchKadaluarsa, setBatchKadaluarsa] = useState<BatchKadaluarsa[]>([]);
  const [produksiData, setProduksiData] = useState<ProduksiData[]>([]);
  const [stokRendahGudang, setStokRendahGudang] = useState<StokRendah[]>([]);
  const [pengembalianData, setPengembalianData] = useState<PengembalianData[]>(
    []
  );

  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );
  const dispatch = useAppDispatch();
  const tableClasses = "text-left rtl:text-right w-full"; // Base table classes
  const cellClasses = "text-center"; // Center alignment for cells

  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const fetchAPI = async (url: string) => {
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      };

      const [
        gudangData,
        batchKadaluarsaData,
        produksiData,
        stokRendahData,
        pengembalianData,
      ] = await Promise.all([
        fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/pimpinan/totalStokGudang`),
        fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/pimpinan/batchKadaluarsa`),
        fetchAPI(
          `${process.env.NEXT_PUBLIC_API_URL}/manajer/batchDiproduksiBulanIni`
        ),
        fetchAPI(
          `${process.env.NEXT_PUBLIC_API_URL}/manajer/stokRendahDiGudang`
        ),
        fetchAPI(
          `${process.env.NEXT_PUBLIC_API_URL}/manajer/totalPengembalianProduk`
        ),
      ]);

      setGudangData(Array.isArray(gudangData) ? gudangData : []);
      setBatchKadaluarsa(batchKadaluarsaData);
      setProduksiData(Array.isArray(produksiData) ? produksiData : []);
      setStokRendahGudang(Array.isArray(stokRendahData) ? stokRendahData : []);
      setPengembalianData(
        Array.isArray(pengembalianData) ? pengembalianData : []
      );
    } catch (err: any) {
      dispatch(
        showErrorToast({
          message: err.message || "Terjadi kesalahan saat memuat data.",
          isDarkMode: isDarkMode,
        })
      );
    }
  }, [token, dispatch, isDarkMode]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: isDarkMode ? "#FFF" : "#333",
        },
      },
    },
    scales: {
      y: {
        ticks: { color: isDarkMode ? "#FFF" : "#333" },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: { color: isDarkMode ? "#FFF" : "#333" },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const stockChartData = {
    labels: gudangData.map((item) => item.product_name),
    datasets: [
      {
        label: "Stok Gudang",
        data: gudangData.map((item) => item.total_stock),
        borderColor: "#4C6EF5",
        backgroundColor: "rgba(76, 110, 245, 0.2)",
        pointBackgroundColor: "#4C6EF5",
        pointBorderColor: "#fff",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Manajer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Total Stok Gudang */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaWarehouse className="text-4xl text-blue-600 mb-2" />
            <h2 className="text-lg font-semibold">Total Stok Gudang</h2>
          </CardHeader>
          <CardBody>
            <div className="w-full h-48">
              <Line data={stockChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Produksi */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaPlusSquare className="text-4xl text-green-500 mb-2" />
            <h2 className="text-lg font-semibold">Produksi Bulan Ini</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Production data table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>KUANTITAS</TableColumn>
              </TableHeader>
              <TableBody>
                {produksiData.length > 0 ? (
                  produksiData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.product_name}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className={cellClasses}>
                      No data available
                    </TableCell>
                    <TableCell className={cellClasses}>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Pengembalian */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaUndo className="text-4xl text-yellow-500 mb-2" />
            <h2 className="text-lg font-semibold">Pengembalian Produk</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Returns data table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>OUTLET</TableColumn>
                <TableColumn className={cellClasses}>KUANTITAS</TableColumn>
              </TableHeader>
              <TableBody>
                {pengembalianData.length > 0 ? (
                  pengembalianData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.product_name}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.outlet_name}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.quantity}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className={cellClasses}>
                      No data available
                    </TableCell>
                    <TableCell className={cellClasses}>-</TableCell>
                    <TableCell className={cellClasses}>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Low Stock Items */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader className="flex items-center">
            <FaExclamationTriangle className="text-xl mr-2 text-red-500" />
            <h2 className="text-xl font-semibold">Stok Rendah di Gudang</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Low stock table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>KUANTITAS</TableColumn>
              </TableHeader>
              <TableBody>
                {stokRendahGudang.length > 0 ? (
                  stokRendahGudang.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>{item.nama}</TableCell>
                      <TableCell className={cellClasses}>
                        {item.kuantitas}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className={cellClasses}>
                      No data available
                    </TableCell>
                    <TableCell className={cellClasses}>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Warehouse Data */}
        <Card className="shadow-lg lg:col-span-1">
          <CardHeader className="flex items-center">
            <FaWarehouse className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Data Gudang</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Warehouse data table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>TOTAL STOK</TableColumn>
              </TableHeader>
              <TableBody>
                {gudangData.length > 0 ? (
                  gudangData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.product_name}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.total_stock}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>
                      {" "}
                      className={cellClasses}No data available
                    </TableCell>
                    <TableCell className={cellClasses}>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Expiring Batches */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaCalendarAlt className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">
              Batch Mendekati Kadaluarsa
            </h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Expiring batch table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>
                  TANGGAL KADALUARSA
                </TableColumn>
              </TableHeader>
              <TableBody>
                {batchKadaluarsa.length > 0 ? (
                  batchKadaluarsa.map((batch, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {batch.product_name}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {formatDate(batch.expiry_date)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className={cellClasses}>
                      No data available
                    </TableCell>
                    <TableCell className={cellClasses}>-</TableCell>
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
