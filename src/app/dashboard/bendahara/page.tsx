"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const Bendahara: React.FC = () => {
  const [ringkasanFaktur, setRingkasanFaktur] = useState<any[]>([]);
  const [pendapatanBulanIni, setPendapatanBulanIni] = useState<number | null>(
    null
  );
  const [fakturJatuhTempo, setFakturJatuhTempo] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const ringkasanRes = await fetch(
        "http://localhost:3008/api/dashboard/ringkasanFaktur",
        { headers }
      );
      const ringkasanData = await ringkasanRes.json();
      setRingkasanFaktur(Array.isArray(ringkasanData) ? ringkasanData : []);

      const pendapatanRes = await fetch(
        "http://localhost:3008/api/dashboard/pendapatanBulanIni",
        { headers }
      );
      const pendapatanData = await pendapatanRes.json();
      setPendapatanBulanIni(pendapatanData[0]?.total_pendapatan || 0);

      const jatuhTempoRes = await fetch(
        "http://localhost:3008/api/dashboard/fakturJatuhTempo",
        { headers }
      );
      const jatuhTempoData = await jatuhTempoRes.json();
      setFakturJatuhTempo(jatuhTempoData[0]?.faktur_jatuh_tempo || 0);
    } catch (err: any) {
      setError(err.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-5 text-center text-indigo-600">
        Dashboard Bendahara
      </h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Ringkasan Faktur Distribusi
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-200">
                  Status Pembayaran
                </th>
                <th className="px-4 py-2 border border-gray-200">
                  Total Tagihan
                </th>
              </tr>
            </thead>
            <tbody>
              {ringkasanFaktur.length > 0 ? (
                ringkasanFaktur.map((item, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2 border border-gray-200">
                      {item.status_pembayaran}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {item.total_tagihan}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Pendapatan Bulan Ini
        </h2>
        <div className="p-6 bg-indigo-50 rounded-md text-center">
          <p className="text-3xl font-bold text-indigo-800">
            {pendapatanBulanIni !== null ? pendapatanBulanIni : "Loading..."}
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Total pendapatan yang diterima pada bulan ini
          </p>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Faktur Jatuh Tempo Hari Ini
        </h2>
        <div className="p-6 bg-red-50 rounded-md text-center">
          <p className="text-3xl font-bold text-red-800">
            {fakturJatuhTempo !== null ? fakturJatuhTempo : "Loading..."}
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Jumlah faktur yang harus dilunasi hari ini
          </p>
        </div>
      </section>
    </div>
  );
};

export default Bendahara;
