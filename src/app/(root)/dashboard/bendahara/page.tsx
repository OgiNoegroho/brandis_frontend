"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showErrorToast, showSuccessToast } from "@/redux/slices/toastSlice";

interface RingkasanFaktur {
  status_pembayaran: string;
  total_tagihan: number;
}

interface OverdueInvoice {
  id: string;
  status_pembayaran: string;
  tanggal_faktur: string;
  tanggal_jatuh_tempo: string;
  jumlah_tagihan: number;
  jumlah_dibayar: number;
}

const DashboardBendahara: React.FC = () => {
  const [ringkasanFaktur, setRingkasanFaktur] = useState<RingkasanFaktur[]>([]);
  const [pendapatanBulanIni, setPendapatanBulanIni] = useState<number | null>(
    null
  );
  const [fakturJatuhTempo, setFakturJatuhTempo] = useState<number | null>(null);
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);

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

      // Fetch overdueInvoices
      const overdueRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/overdueInvoices`,
        { headers }
      );
      if (!overdueRes.ok)
        throw new Error("Gagal memuat faktur yang telah jatuh tempo.");
      const overdueData: OverdueInvoice[] = await overdueRes.json();
      setOverdueInvoices(overdueData);

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
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Bendahara
      </h1>

      {/* Ringkasan Faktur Distribusi */}
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

      {/* Pendapatan Bulan Ini */}
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

      {/* Faktur Jatuh Tempo Hari Ini */}
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

      {/* Overdue Invoices */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Faktur Jatuh Tempo
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-200">ID Faktur</th>
                <th className="px-4 py-2 border border-gray-200">
                  Status Pembayaran
                </th>
                <th className="px-4 py-2 border border-gray-200">
                  Tanggal Jatuh Tempo
                </th>
                <th className="px-4 py-2 border border-gray-200">
                  Jumlah Tagihan
                </th>
              </tr>
            </thead>
            <tbody>
              {overdueInvoices.length > 0 ? (
                overdueInvoices.map((invoice, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.id}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.status_pembayaran}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.tanggal_jatuh_tempo}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.jumlah_tagihan}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4">
                    No overdue invoices
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

export default DashboardBendahara;
