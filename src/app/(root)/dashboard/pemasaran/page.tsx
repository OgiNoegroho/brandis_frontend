"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FaWarehouse, FaArrowDown, FaTrophy, FaUndo } from "react-icons/fa";
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

const Pemasaran: React.FC = () => {
  const [totalStokOutlet, setTotalStokOutlet] = useState<any[]>([]);
  const [outletStokRendah, setOutletStokRendah] = useState<any[]>([]);
  const [outletTerbaik, setOutletTerbaik] = useState<any[]>([]);
  const [produkDikembalikan, setProdukDikembalikan] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const endpoints = [
        "totalStokOutlet",
        "outletStokRendah",
        "outletTerbaik",
        "totalProdukDikembalikan",
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(`http://localhost:3008/api/pemasaran/${endpoint}`, {
            headers,
          }).then((res) => res.json())
        )
      );

      setTotalStokOutlet(responses[0]);
      setOutletStokRendah(responses[1]);
      setOutletTerbaik(responses[2]);
      setProdukDikembalikan(responses[3]);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="container px-6 lg:px-12 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Pemasaran
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-4 gap-6">
        {/* Left Column (2 cols wide) */}
        <div className="col-span-3 grid grid-rows-2 gap-6">
          {/* Total Stok Outlet */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col items-center">
              <FaWarehouse className="text-4xl text-indigo-500 mb-2" />
              <h2 className="text-lg font-semibold">Total Stok Outlet</h2>
            </CardHeader>
            <CardBody>
              <Table aria-label="Total Stok Outlet">
                <TableHeader>
                  <TableColumn>OUTLET</TableColumn>
                  <TableColumn>PRODUK</TableColumn>
                  <TableColumn>KUANTITAS</TableColumn>
                </TableHeader>
                <TableBody>
                  {totalStokOutlet.map((outlet, index) => (
                    <TableRow key={index}>
                      <TableCell>{outlet.outlet_nama}</TableCell>
                      <TableCell>{outlet.jumlah_produk}</TableCell>
                      <TableCell>{outlet.total_kuantitas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>

          {/* Bottom Row with two cards */}
          <div className="grid grid-cols-2 gap-6">
            {/* Outlet Terbaik */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <FaTrophy className="text-4xl text-yellow-500 mb-2" />
                <h2 className="text-lg font-semibold">
                  Outlet dengan Penjualan Terbaik
                </h2>
              </CardHeader>
              <CardBody>
                {outletTerbaik.length > 0 ? (
                  outletTerbaik.map((outlet, index) => (
                    <div
                      key={index}
                      className="p-2 mb-2 bg-white rounded shadow-sm"
                    >
                      <p className="text-sm">
                        <span className="font-medium">
                          {outlet.outlet_nama}
                        </span>{" "}
                        - {outlet.produk_nama}:{" "}
                        <span className="text-green-500">
                          {outlet.total_terjual}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No best selling outlet found.
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Produk Dikembalikan */}
            <Card className="shadow-lg">
              <CardHeader className="flex flex-col items-center">
                <FaUndo className="text-4xl text-indigo-500 mb-2" />
                <h2 className="text-lg font-semibold">Produk Dikembalikan</h2>
              </CardHeader>
              <CardBody>
                {produkDikembalikan.length > 0 ? (
                  produkDikembalikan.map((data, index) => (
                    <div
                      key={index}
                      className="p-2 mb-2 bg-white rounded shadow-sm"
                    >
                      <p className="text-sm">
                        <span className="font-medium">{data.outlet_nama}</span>{" "}
                        - {data.produk_nama}:{" "}
                        <span className="text-orange-500">
                          {data.total_dikembalikan}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({data.bulan_pengembalian})
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No returned products found.
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Right Column (1 col wide) - Outlet Stok Rendah */}
        <Card className="shadow-lg row-span-2">
          <CardHeader className="flex flex-col items-center">
            <FaArrowDown className="text-4xl text-red-500 mb-2" />
            <h2 className="text-lg font-semibold">Outlet dengan Stok Rendah</h2>
          </CardHeader>
          <CardBody>
            {outletStokRendah.length > 0 ? (
              outletStokRendah.map((outlet, index) => (
                <div
                  key={index}
                  className="p-2 mb-2 bg-white rounded shadow-sm"
                >
                  <p className="text-sm">
                    <span className="font-medium">{outlet.outlet_nama}</span> -{" "}
                    {outlet.produk_nama}:{" "}
                    <span className="text-red-500">{outlet.stok}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No outlet with low stock found.
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Pemasaran;
