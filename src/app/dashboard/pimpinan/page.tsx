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
        "http://localhost:3008/api/dashboard/totalPenjualan",
        { headers }
      );
      const totalPenjualanData = await totalPenjualanRes.json();
      setTotalPenjualan(totalPenjualanData[0]?.total_penjualan || 0);

      const totalDistribusiRes = await fetch(
        "http://localhost:3008/api/dashboard/totalDistribusi",
        { headers }
      );
      const totalDistribusiData = await totalDistribusiRes.json();
      setTotalDistribusi(totalDistribusiData[0]?.total_distribusi || 0);

      const topProdukTerlarisRes = await fetch(
        "http://localhost:3008/api/dashboard/topProdukTerlaris",
        { headers }
      );
      const topProdukTerlarisData = await topProdukTerlarisRes.json();
      setTopProdukTerlaris(topProdukTerlarisData);

      const totalStokGudangRes = await fetch(
        "http://localhost:3008/api/dashboard/totalStokGudang",
        { headers }
      );
      const totalStokGudangData = await totalStokGudangRes.json();
      setTotalStokGudang(totalStokGudangData[0]?.total_stok_gudang || 0);

      const batchKadaluarsaRes = await fetch(
        "http://localhost:3008/api/dashboard/batchKadaluarsa",
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
    <div className="p-5 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center text-indigo-600">
        Dashboard Pimpinan
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Total Penjualan */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FaChartBar className="text-indigo-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Total Penjualan (Bulan Ini)
              </h2>
              <p className="text-lg text-gray-600">
                {totalPenjualan !== null ? totalPenjualan : "Loading..."}
              </p>
            </div>
          </div>
        </section>

        {/* Total Distribusi */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FaShippingFast className="text-green-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Total Kuantitas Produk Didistribusi (Bulan Ini)
              </h2>
              <p className="text-lg text-gray-600">
                {totalDistribusi !== null ? totalDistribusi : "Loading..."}
              </p>
            </div>
          </div>
        </section>

        {/* Total Stok Gudang */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FaWarehouse className="text-blue-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Total Stok di Gudang
              </h2>
              <p className="text-lg text-gray-600">
                {totalStokGudang !== null ? totalStokGudang : "Loading..."}
              </p>
            </div>
          </div>
        </section>

        {/* Batch Kadaluarsa */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FaCalendarAlt className="text-red-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Batch 1 Bulan Mendekati Kadaluarsa
              </h2>
              <p className="text-lg text-gray-600">
                {batchKadaluarsa !== null ? batchKadaluarsa : "Loading..."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Top 5 Produk Terlaris (Centered and Full Width) */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow">
        <div className="flex justify-center items-center">
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
              Produk Terlaris Bulan ini
            </h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-center border-collapse border border-gray-200 bg-transparent">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200">
                      Nama Produk
                    </th>
                    <th className="px-4 py-2 border border-gray-200">
                      Total Terjual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProdukTerlaris.length > 0 ? (
                    topProdukTerlaris.map((produk, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-2 border border-gray-200">
                          {produk.nama_produk}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {produk.total_terjual}
                        </td>
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default PimpinanDashboard;
