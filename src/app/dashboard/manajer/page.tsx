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
        "https://brandis-backend.vercel.app/api/dashboard/produk",
        { headers }
      );
      const gudangData = await gudangRes.json();
      setGudangData(gudangData);

      const stokGudangRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/totalStokGudang",
        { headers }
      );
      const stokGudangData = await stokGudangRes.json();
      setTotalStokGudang(stokGudangData[0]?.total_stok_gudang || 0);

      const kadaluarsaRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/batchKadaluarsa",
        { headers }
      );
      const kadaluarsaData = await kadaluarsaRes.json();
      setBatchKadaluarsa(kadaluarsaData[0]?.total_batch_kadaluarsa || 0);

      const diproduksiRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/batchDiproduksiBulanIni",
        { headers }
      );
      const diproduksiData = await diproduksiRes.json();
      setBatchDiproduksiBulanIni(diproduksiData[0]?.batch_diproduksi || 0);

      const stokRendahRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/stokRendahDiGudang",
        { headers }
      );
      const stokRendahData = await stokRendahRes.json();
      setStokRendahGudang(stokRendahData);

      const pengembalianRes = await fetch(
        "https://brandis-backend.vercel.app/api/dashboard/totalPengembalianProduk",
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
    <div className="container px-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        Dashboard Manajer
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 p-6 text-center">
            <FaWarehouse className="text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Total Stok Gudang</h2>
            <p className="text-xl font-medium">
              {totalStokGudang !== null ? totalStokGudang : "Loading..."}
            </p>
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 p-6 text-center">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">Batch Kadaluarsa</h2>
            <p className="text-xl font-medium">
              {batchKadaluarsa !== null ? batchKadaluarsa : "Loading..."}
            </p>
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 p-6 text-center">
            <FaPlusSquare className="text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">
              Batch Diproduksi Bulan Ini
            </h2>
            <p className="text-xl font-medium">
              {batchDiproduksiBulanIni !== null
                ? batchDiproduksiBulanIni
                : "Loading..."}
            </p>
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 p-6 text-center">
            <FaUndo className="text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold">
              Total Pengembalian Produk
            </h2>
            <p className="text-xl font-medium">
              {totalPengembalianProduk !== null
                ? totalPengembalianProduk
                : "Loading..."}
            </p>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 mb-8 transition-shadow">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Stok Rendah di Gudang
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-gray-800">
                  Nama Produk
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-gray-800">
                  Kuantitas
                </th>
              </tr>
            </thead>
            <tbody>
              {stokRendahGudang.length > 0 ? (
                stokRendahGudang.map((item, index) => (
                  <tr
                    key={index}
                    className={`$ {
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4 border-b border-gray-300">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300">
                      {item.kuantitas}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-6 text-gray-500">
                    No low stock items
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

export default DashboardManajer;
