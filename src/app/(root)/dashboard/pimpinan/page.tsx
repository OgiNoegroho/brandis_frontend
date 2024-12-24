"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  FaChartBar,
  FaShippingFast,
  FaWarehouse,
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
  TableRow,
  TableHeader,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PimpinanDashboard: React.FC = () => {
  const [totalPenjualan, setTotalPenjualan] = useState<number | null>(null);
  const [totalDistribusi, setTotalDistribusi] = useState<number | null>(null);
  const [topProdukTerlaris, setTopProdukTerlaris] = useState<any[]>([]);
  const [totalStokGudang, setTotalStokGudang] = useState<any[]>([]);
  const [batchKadaluarsa, setBatchKadaluarsa] = useState<any[]>([]);
  const [penjualanData, setPenjualanData] = useState<any>(null);
  const [distribusiData, setDistribusiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const fetchAPI = async (url: string) => {
        const res = await fetch(url, { headers });
        return res.json();
      };

      const totalPenjualanData = await fetchAPI(
        "http://localhost:3008/api/pimpinan/totalPenjualan"
      );
      const totalSales = totalPenjualanData.reduce(
        (acc: number, item: any) => acc + parseFloat(item.total_sales),
        0
      );
      setTotalPenjualan(totalSales);
      setPenjualanData(
        totalPenjualanData.map((item: any) => ({
          month: item.product_name,
          total: parseFloat(item.total_sales),
        })) || []
      );

      const totalDistribusiData = await fetchAPI(
        "http://localhost:3008/api/pimpinan/totalDistribusi"
      );
      const totalDistribution = totalDistribusiData.reduce(
        (acc: number, item: any) => acc + parseFloat(item.total_distribution),
        0
      );
      setTotalDistribusi(totalDistribution);
      setDistribusiData(
        totalDistribusiData.map((item: any) => ({
          month: item.product_name,
          total: parseFloat(item.total_distribution),
        })) || []
      );

      const topProdukTerlarisData = await fetchAPI(
        "http://localhost:3008/api/pimpinan/topProdukTerlaris"
      );
      setTopProdukTerlaris(topProdukTerlarisData);

      const totalStokGudangData = await fetchAPI(
        "http://localhost:3008/api/pimpinan/totalStokGudang"
      );
      setTotalStokGudang(totalStokGudangData);

      const batchKadaluarsaData = await fetchAPI(
        "http://localhost:3008/api/pimpinan/batchKadaluarsa"
      );
      setBatchKadaluarsa(batchKadaluarsaData);
    } catch (err: any) {
      setError(err.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

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

  const salesChartData = {
    labels: penjualanData?.map((item: any) => item.month) || [],
    datasets: [
      {
        label: "Total Penjualan (Bulan Ini)",
        data: penjualanData?.map((item: any) => item.total) || [],
        borderColor: "#4C6EF5",
        backgroundColor: "rgba(76, 110, 245, 0.2)",
        pointBackgroundColor: "#4C6EF5",
        pointBorderColor: "#fff",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const distribusiChartData = {
    labels: distribusiData?.map((item: any) => item.month) || [],
    datasets: [
      {
        label: "Total Distribusi (Bulan Ini)",
        data: distribusiData?.map((item: any) => item.total) || [],
        borderColor: "#34D399",
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        pointBackgroundColor: "#34D399",
        pointBorderColor: "#fff",
        fill: true,
        tension: 0.4,
      },
    ],
  };

    const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container px-6 lg:px-12 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Pimpinan
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Row 1: a, b, c */}
        {/* Total Penjualan (a) */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaChartBar className="text-4xl text-blue-600 mb-2" />
            <h2 className="text-lg font-semibold">Total Penjualan</h2>
            <p className="text-xl font-bold">
              {totalPenjualan !== null
                ? formatCurrency(totalPenjualan)
                : "Loading..."}
            </p>
          </CardHeader>
          <CardBody>
            <div className="w-full h-48">
              <Line data={salesChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Total Distribusi (b) */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <FaShippingFast className="text-4xl text-green-500 mb-2" />
            <h2 className="text-lg font-semibold">Total Distribusi</h2>
            <p className="text-xl font-bold">
              {totalDistribusi !== null
                ? formatCurrency(totalDistribusi)
                : "Loading..."}
            </p>
          </CardHeader>
          <CardBody>
            <div className="w-full h-48">
              <Line data={distribusiChartData} options={chartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Total Stok Gudang (c) */}
        <Card className="shadow-lg lg:row-span-2">
          <CardHeader className="flex items-center">
            <FaWarehouse className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Total Stok Gudang</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Total stock table">
              <TableHeader>
                <TableColumn>NAMA PRODUK</TableColumn>
                <TableColumn>TOTAL STOK</TableColumn>
              </TableHeader>
              <TableBody>
                {totalStokGudang.length > 0 ? (
                  totalStokGudang.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.total_stock}</TableCell>
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

        {/* Row 2: d, d */}
        {/* Produk Terlaris (d) - spans 2 columns */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader className="flex items-center">
            <FaChartBar className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Produk Terlaris Bulan Ini</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Top products table">
              <TableHeader>
                <TableColumn>NAMA PRODUK</TableColumn>
                <TableColumn>TOTAL TERJUAL</TableColumn>
                <TableColumn>TOTAL PENJUALAN</TableColumn>
              </TableHeader>
              <TableBody>
                {topProdukTerlaris.length > 0 ? (
                  topProdukTerlaris.map((produk, index) => (
                    <TableRow key={index}>
                      <TableCell>{produk.product_name}</TableCell>
                      <TableCell>{produk.quantity_sold}</TableCell>
                      <TableCell>
                        {formatCurrency(produk.total_sales)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No data available</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Row 3: e, e, e */}
      <div className="grid grid-cols-1 gap-4">
        {/* Batch Kadaluarsa (e) */}
        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaCalendarAlt className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">
              Batch Mendekati Kadaluarsa
            </h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Expiring batch table">
              <TableHeader>
                <TableColumn>NAMA PRODUK</TableColumn>
                <TableColumn>TANGGAL KADALUARSA</TableColumn>
              </TableHeader>
              <TableBody>
                {batchKadaluarsa.length > 0 ? (
                  batchKadaluarsa.map((batch, index) => (
                    <TableRow key={index}>
                      <TableCell>{batch.product_name}</TableCell>
                      <TableCell>
                        {new Date(batch.expiry_date).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
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

export default PimpinanDashboard;
