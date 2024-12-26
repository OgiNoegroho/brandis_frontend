"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showErrorToast, showSuccessToast } from "@/redux/slices/toastSlice";

// Define types
interface RingkasanFaktur {
  status_pembayaran: string;
  total_tagihan: number;
}

const Bendahara: React.FC = () => {
  const [ringkasanFaktur, setRingkasanFaktur] = useState<RingkasanFaktur[]>([]);
  const [pendapatanBulanIni, setPendapatanBulanIni] = useState<number | null>(
    null
  );
  const [fakturJatuhTempo, setFakturJatuhTempo] = useState<number | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();

  // Fetch data with useCallback to avoid redefining in useEffect
  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch ringkasanFakturDistribusi
      const ringkasanRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/ringkasanFakturDistribusi`,
        { headers }
      );
      if (!ringkasanRes.ok) throw new Error("Gagal memuat ringkasan faktur.");
      const ringkasanData: RingkasanFaktur[] = await ringkasanRes.json();
      setRingkasanFaktur(Array.isArray(ringkasanData) ? ringkasanData : []);

      // Fetch pendapatanBulanIni
      const pendapatanRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/pendapatanBulanIni`,
        { headers }
      );
      if (!pendapatanRes.ok)
        throw new Error("Gagal memuat pendapatan bulan ini.");
      const pendapatanData = await pendapatanRes.json();
      setPendapatanBulanIni(pendapatanData[0]?.total_pendapatan || 0);

      // Fetch fakturJatuhTempoHariIni
      const jatuhTempoRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/fakturJatuhTempoHariIni`,
        { headers }
      );
      if (!jatuhTempoRes.ok)
        throw new Error("Gagal memuat faktur jatuh tempo hari ini.");
      const jatuhTempoData = await jatuhTempoRes.json();
      setFakturJatuhTempo(jatuhTempoData[0]?.faktur_jatuh_tempo || 0);

      // Show success toast for successful data fetch
      dispatch(
        showSuccessToast({
          message: "Data berhasil dimuat.",
          isDarkMode: false, // Adjust this based on your app's theme
        })
      );
    } catch (err: any) {
      // Show error toast if an error occurs
      dispatch(
        showErrorToast({
          message: err.message || "Terjadi kesalahan saat memuat data.",
          isDarkMode: false, // Adjust this based on your app's theme
        })
      );
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  return (
    <div className="container px-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-3xl font-bold mb-5 text-center text-indigo-600">
        Dashboard Bendahara
      </h1>

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
