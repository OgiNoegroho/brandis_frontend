"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import {
  FaStore,
  FaExclamationTriangle,
  FaChartLine,
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
import { showErrorToast } from "@/lib/redux/slices/toastSlice";

interface OutletStock {
  outlet_nama: string;
  jumlah_produk: number;
  total_kuantitas: number;
}

interface LowStock {
  outlet_nama: string;
  produk_nama: string;
  stok: number;
}

interface OutletPerformance {
  outlet_nama: string;
  total_terjual: number;
}

interface PengembalianData {
  produk_nama: string;
  outlet_nama: string;
  total_dikembalikan: number;
  bulan_pengembalian: string;
}

const DashboardPemasaran: React.FC = () => {
  const [outletStock, setOutletStock] = useState<OutletStock[]>([]);
  const [lowStock, setLowStock] = useState<LowStock[]>([]);
  const [bestOutlet, setBestOutlet] = useState<OutletPerformance[]>([]);
  const [worstOutlet, setWorstOutlet] = useState<OutletPerformance[]>([]);
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

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const fetchAPI = async (url: string) => {
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`Failed to fetch data from ${url}`);
        return res.json();
      };

      const [
        outletStockData,
        lowStockData,
        bestOutletData,
        worstOutletData,
        pengembalianData,
      ] = await Promise.all([
        fetchAPI(
          `${process.env.NEXT_PUBLIC_API_URL}/pemasaran/totalStokOutlet`
        ),
        fetchAPI(
          `${process.env.NEXT_PUBLIC_API_URL}/pemasaran/outletStokRendah`
        ),
        fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/pemasaran/outletTerbaik`),
        fetchAPI(`${process.env.NEXT_PUBLIC_API_URL}/pemasaran/outletTerendah`),
        fetchAPI(
          `${process.env.NEXT_PUBLIC_API_URL}/pemasaran/totalProdukDikembalikan`
        ),
      ]);

      setOutletStock(outletStockData);
      setLowStock(lowStockData);
      setBestOutlet(bestOutletData);
      setWorstOutlet(worstOutletData);
      setPengembalianData(pengembalianData);
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

  return (
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Pemasaran
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Best Performing Outlets */}
        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaChartLine className="text-xl mr-2 text-green-500" />
            <h2 className="text-lg font-semibold">Outlet Penjualan Terbaik</h2>
          </CardHeader>
          <CardBody>
            <Table
              aria-label="Best performing outlets table"
              className={tableClasses}
            >
              <TableHeader>
                <TableColumn className={cellClasses}>OUTLET</TableColumn>
                <TableColumn className={cellClasses}>TOTAL TERJUAL</TableColumn>
              </TableHeader>
              <TableBody>
                {bestOutlet && bestOutlet.length > 0 ? (
                  bestOutlet.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.outlet_nama}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.total_terjual}
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

        {/* Worst Performing Outlets */}
        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaChartLine className="text-xl mr-2 text-red-500" />
            <h2 className="text-lg font-semibold">Outlet Penjualan Terendah</h2>
          </CardHeader>
          <CardBody>
            <Table
              aria-label="Worst performing outlets table"
              className={tableClasses}
            >
              <TableHeader>
                <TableColumn className={cellClasses}>OUTLET</TableColumn>
                <TableColumn className={cellClasses}>TOTAL TERJUAL</TableColumn>
              </TableHeader>
              <TableBody>
                {worstOutlet && worstOutlet.length > 0 ? (
                  worstOutlet.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.outlet_nama}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.total_terjual}
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

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Pengembalian */}
        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaUndo className="text-xl mr-2 text-yellow-500" />
            <h2 className="text-lg font-semibold">Pengembalian Produk</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Returns data table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>NAMA PRODUK</TableColumn>
                <TableColumn className={cellClasses}>OUTLET</TableColumn>
                <TableColumn className={cellClasses}>
                  JUMLAH DIKEMBALIKAN
                </TableColumn>
                <TableColumn className={cellClasses}>BULAN</TableColumn>
              </TableHeader>
              <TableBody>
                {pengembalianData.length > 0 ? (
                  pengembalianData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.produk_nama}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.outlet_nama}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.total_dikembalikan}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.bulan_pengembalian}
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
                    <TableCell className={cellClasses}>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Outlet Stock Table */}
        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaStore className="text-xl mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold">Stok Outlet</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Outlet stock table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>OUTLET</TableColumn>
                <TableColumn className={cellClasses}>JUMLAH PRODUK</TableColumn>
                <TableColumn className={cellClasses}>TOTAL STOK</TableColumn>
              </TableHeader>
              <TableBody>
                {outletStock.length > 0 ? (
                  outletStock.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.outlet_nama}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.jumlah_produk}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.total_kuantitas}
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

        {/* Low Stock Table */}
        <Card className="shadow-lg">
          <CardHeader className="flex items-center">
            <FaExclamationTriangle className="text-xl mr-2 text-red-500" />
            <h2 className="text-xl font-semibold">Stok Rendah di Outlet</h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Low stock table" className={tableClasses}>
              <TableHeader>
                <TableColumn className={cellClasses}>OUTLET</TableColumn>
                <TableColumn className={cellClasses}>PRODUK</TableColumn>
                <TableColumn className={cellClasses}>STOK</TableColumn>
              </TableHeader>
              <TableBody>
                {lowStock.length > 0 ? (
                  lowStock.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className={cellClasses}>
                        {item.outlet_nama}
                      </TableCell>
                      <TableCell className={cellClasses}>
                        {item.produk_nama}
                      </TableCell>
                      <TableCell className={cellClasses}>{item.stok}</TableCell>
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
    </div>
  );
};

export default DashboardPemasaran;
