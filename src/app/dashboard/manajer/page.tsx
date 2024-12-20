"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  FaBoxOpen,
  FaWarehouse,
  FaExclamationTriangle,
  FaArrowAltCircleUp,
  FaRecycle,
  FaProductHunt,
  FaFill,
  FaIndustry,
  FaPlusSquare,
  FaUndo,
} from "react-icons/fa";

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
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const gudangRes = await fetch(
        "http://localhost:3008/api/dashboard/produk",
        { headers }
      );
      const gudangData = await gudangRes.json();
      setGudangData(gudangData);

      const stokGudangRes = await fetch(
        "http://localhost:3008/api/dashboard/totalStokGudang",
        { headers }
      );
      const stokGudangData = await stokGudangRes.json();
      setTotalStokGudang(stokGudangData[0]?.total_stok_gudang || 0);

      const kadaluarsaRes = await fetch(
        "http://localhost:3008/api/dashboard/batchKadaluarsa",
        { headers }
      );
      const kadaluarsaData = await kadaluarsaRes.json();
      setBatchKadaluarsa(kadaluarsaData[0]?.total_batch_kadaluarsa || 0);

      const diproduksiRes = await fetch(
        "http://localhost:3008/api/dashboard/batchDiproduksiBulanIni",
        { headers }
      );
      const diproduksiData = await diproduksiRes.json();
      setBatchDiproduksiBulanIni(diproduksiData[0]?.batch_diproduksi || 0);

      const stokRendahRes = await fetch(
        "http://localhost:3008/api/dashboard/stokRendahDiGudang",
        { headers }
      );
      const stokRendahData = await stokRendahRes.json();
      setStokRendahGudang(stokRendahData);

      const pengembalianRes = await fetch(
        "http://localhost:3008/api/dashboard/totalPengembalianProduk",
        { headers }
      );
      const pengembalianData = await pengembalianRes.json();
      setTotalPengembalianProduk(
        pengembalianData[0]?.total_produk_dikembalikan || 0
      );
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
        Dashboard Manajer
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Total Stok Gudang */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FaWarehouse className="text-blue-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Total Stok Gudang
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
            <FaExclamationTriangle className="text-red-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Batch Kadaluarsa
              </h2>
              <p className="text-lg text-gray-600">
                {batchKadaluarsa !== null ? batchKadaluarsa : "Loading..."}
              </p>
            </div>
          </div>
        </section>

        {/* Batch Diproduksi Bulan Ini */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FaPlusSquare className="text-green-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Batch Diproduksi Bulan Ini
              </h2>
              <p className="text-lg text-gray-600">
                {batchDiproduksiBulanIni !== null
                  ? batchDiproduksiBulanIni
                  : "Loading..."}
              </p>
            </div>
          </div>
        </section>

        {/* Total Pengembalian Produk */}
        <section className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FaUndo className="text-yellow-600 text-4xl" />
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Total Pengembalian Produk
              </h2>
              <p className="text-lg text-gray-600">
                {totalPengembalianProduk !== null
                  ? totalPengembalianProduk
                  : "Loading..."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Stok Rendah di Gudang */}
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8 hover:shadow-xl transition-shadow">
        <div className="flex justify-center items-center">
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
              Stok Rendah di Gudang
            </h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-center border-collapse border border-gray-200 bg-transparent">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200">
                      Nama Produk
                    </th>
                    <th className="px-4 py-2 border border-gray-200">
                      Kuantitas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stokRendahGudang.length > 0 ? (
                    stokRendahGudang.map((item, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-2 border border-gray-200">
                          {item.nama}
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          {item.kuantitas}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center py-4">
                        No low stock items
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

export default DashboardManajer;
