//C:\Users\Acer\Brandis\brandis_frontend\src\app\(root)\dashboard\pimpinan\page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
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

// Define interfaces for the API responses
interface PenjualanData {
  product_name: string;
  total_sales: string;
}

interface DistribusiData {
  product_name: string;
  total_distribution: string;
}

interface ProdukTerlaris {
  product_name: string;
  quantity_sold: number;
  total_sales: number;
}

interface StokGudang {
  product_name: string;
  total_stock: number;
}

interface BatchKadaluarsa {
  product_name: string;
  expiry_date: string;
}

const PimpinanDashboard: React.FC = () => {
  const [totalPenjualan, setTotalPenjualan] = useState<number | null>(null);
  const [totalDistribusi, setTotalDistribusi] = useState<number | null>(null);
  const [topProdukTerlaris, setTopProdukTerlaris] = useState<ProdukTerlaris[]>(
    []
  );
  const [totalStokGudang, setTotalStokGudang] = useState<StokGudang[]>([]);
  const [batchKadaluarsa, setBatchKadaluarsa] = useState<BatchKadaluarsa[]>([]);
  const [penjualanData, setPenjualanData] = useState<PenjualanData[] | null>(
    null
  );
  const [distribusiData, setDistribusiData] = useState<DistribusiData[] | null>(
    null
  );

  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );
  const dispatch = useAppDispatch();
  const tableClasses = "text-left rtl:text-right w-full"; // Base table classes
  const cellClasses = "text-center"; // Center alignment for cells

  // Memoize the fetchData function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const fetchAPI = async (url: string) => {
        const res = await fetch(url, { headers });
        return res.json();
      };

      const totalPenjualanData: PenjualanData[] = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/totalPenjualan`
      );
      const totalSales = totalPenjualanData.reduce(
        (acc, item) => acc + parseFloat(item.total_sales),
        0
      );
      setTotalPenjualan(totalSales);
      setPenjualanData(
        totalPenjualanData.map((item) => ({
          product_name: item.product_name, // Keep the product_name
          total_sales: item.total_sales, // Keep the total_sales
        })) || []
      );

      const totalDistribusiData: DistribusiData[] = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/totalDistribusi`
      );
      const totalDistribution = totalDistribusiData.reduce(
        (acc, item) => acc + parseFloat(item.total_distribution),
        0
      );
      setTotalDistribusi(totalDistribution);
      setDistribusiData(
        totalDistribusiData.map((item) => ({
          product_name: item.product_name, // Keep the product_name
          total_distribution: item.total_distribution, // Keep the total_distribution
        })) || []
      );

      const topProdukTerlarisData: ProdukTerlaris[] = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/topProdukTerlaris`
      );
      setTopProdukTerlaris(topProdukTerlarisData);

      const totalStokGudangData: StokGudang[] = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/totalStokGudang`
      );
      setTotalStokGudang(totalStokGudangData);

      const batchKadaluarsaData: BatchKadaluarsa[] = await fetchAPI(
        `${process.env.NEXT_PUBLIC_API_URL}/pimpinan/batchKadaluarsa`
      );
      setBatchKadaluarsa(batchKadaluarsaData);
    } catch (err: any) {
      const errorMessage = err.message || "Terjadi kesalahan saat memuat data.";
      dispatch(
        showErrorToast({
          message: errorMessage,
          isDarkMode: isDarkMode,
        })
      );
    }
  }, [token, dispatch, isDarkMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    labels: penjualanData?.map((item) => item.product_name) || [], // Use product_name as labels
    datasets: [
      {
        label: "Total Penjualan (Bulan Ini)",
        data: penjualanData?.map((item) => parseFloat(item.total_sales)) || [], // Use total_sales for data
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
    labels: distribusiData?.map((item) => item.product_name) || [], // Use product_name as labels
    datasets: [
      {
        label: "Total Distribusi (Bulan Ini)",
        data:
          distribusiData?.map((item) => parseFloat(item.total_distribution)) ||
          [], // Use total_distribution for data
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
    <div className="container px-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Pimpinan
      </h1>

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
            <Table aria-label="Total stock table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>TOTAL STOK</TableColumn>
              </TableHeader>
              <TableBody>
                {totalStokGudang.length > 0 ? (
                  totalStokGudang.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {product.product_name}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {product.total_stock}
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

        {/* Row 2: d, d */}
        {/* Produk Terlaris (d) - spans 2 columns */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader className="flex items-center">
            <FaChartBar className="text-xl mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Produk Terlaris Bulan Ini</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Top products table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>TOTAL TERJUAL</TableColumn>
                <TableColumn className={cellClasses}>
                  TOTAL PENJUALAN
                </TableColumn>
              </TableHeader>
              <TableBody>
                {topProdukTerlaris.length > 0 ? (
                  topProdukTerlaris.map((produk, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {produk.product_name}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {produk.quantity_sold}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {formatCurrency(produk.total_sales)}
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

export default PimpinanDashboard;
