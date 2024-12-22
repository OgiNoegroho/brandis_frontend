"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  FaChartBar,
  FaBoxOpen,
  FaWarehouse,
  FaCalendarAlt,
  FaCar,
  FaShippingFast,
} from "react-icons/fa";

const PimpinanDashboard: React.FC = () => {
  const [totalPenjualan, setTotalPenjualan] = useState<number | null>(null);
  const [totalDistribusi, setTotalDistribusi] = useState<number | null>(null);
  const [topProdukTerlaris, setTopProdukTerlaris] = useState<any[]>([]);
  const [totalStokGudang, setTotalStokGudang] = useState<number | null>(null);
  const [batchKadaluarsa, setBatchKadaluarsa] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const totalPenjualanRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/totalPenjualan",
        { headers }
      );
      const totalPenjualanData = await totalPenjualanRes.json();
      setTotalPenjualan(totalPenjualanData[0]?.total_penjualan || 0);

      const totalDistribusiRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/totalDistribusi",
        { headers }
      );
      const totalDistribusiData = await totalDistribusiRes.json();
      setTotalDistribusi(totalDistribusiData[0]?.total_distribusi || 0);

      const topProdukTerlarisRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/topProdukTerlaris",
        { headers }
      );
      const topProdukTerlarisData = await topProdukTerlarisRes.json();
      setTopProdukTerlaris(topProdukTerlarisData);

      const totalStokGudangRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/totalStokGudang",
        { headers }
      );
      const totalStokGudangData = await totalStokGudangRes.json();
      setTotalStokGudang(totalStokGudangData[0]?.total_stok_gudang || 0);

      const batchKadaluarsaRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/batchKadaluarsa",
        { headers }
      );
      const batchKadaluarsaData = await batchKadaluarsaRes.json();
      setBatchKadaluarsa(batchKadaluarsaData[0]?.total_batch_kadaluarsa || 0);
    } catch (err: any) {
      setError(err.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="container px-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Pimpinan
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Example Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <FaChartBar className="text-4xl mb-4 mx-auto" />
          <h2 className="text-lg font-semibold mb-2 text-center">
            Total Penjualan (Bulan Ini)
          </h2>
          <p className="text-center text-2xl font-bold">
            {totalPenjualan !== null ? totalPenjualan : "Loading..."}
          </p>
        </div>

        {/* Total Distribusi */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <FaShippingFast className="text-4xl mb-4 mx-auto" />
          <h2 className="text-lg font-semibold mb-2 text-center">
            Total Distribusi (Bulan Ini)
          </h2>
          <p className="text-center text-2xl font-bold">
            {totalDistribusi !== null ? totalDistribusi : "Loading..."}
          </p>
        </div>

        {/* Total Stok Gudang */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <FaWarehouse className="text-4xl mb-4 mx-auto" />
          <h2 className="text-lg font-semibold mb-2 text-center">
            Total Stok Gudang
          </h2>
          <p className="text-center text-2xl font-bold">
            {totalStokGudang !== null ? totalStokGudang : "Loading..."}
          </p>
        </div>

        {/* Batch Kadaluarsa */}
        <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <FaCalendarAlt className="text-4xl mb-4 mx-auto" />
          <h2 className="text-lg font-semibold mb-2 text-center">
            Batch Mendekati Kadaluarsa
          </h2>
          <p className="text-center text-2xl font-bold">
            {batchKadaluarsa !== null ? batchKadaluarsa : "Loading..."}
          </p>
        </div>
      </div>

      {/* Tabel */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Produk Terlaris Bulan Ini
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Nama Produk</th>
                <th className="px-4 py-2">Total Terjual</th>
              </tr>
            </thead>
            <tbody>
              {topProdukTerlaris.length > 0 ? (
                topProdukTerlaris.map((produk, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-2">{produk.nama_produk}</td>
                    <td className="px-4 py-2">{produk.total_terjual}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PimpinanDashboard;
