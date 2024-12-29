"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showErrorToast, showSuccessToast } from "@/redux/slices/toastSlice";

interface OverdueInvoice {
  faktur_id: string;
  distribusi_id: string;
  tanggal_faktur: string;
  tanggal_jatuh_tempo: string;
  overdue_days: number;
  jumlah_tagihan: number;
  jumlah_dibayar: number;
  sisa_tagihan: number;
}

interface FinancialSummary {
  outlet_name: string;
  total_revenue: number;
  total_debt: number;
  remaining_balance: number;
}

const DashboardBendahara: React.FC = () => {
  const [totalOutstandingInvoices, setTotalOutstandingInvoices] = useState<
    number | null
  >(null);
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary[]>(
    []
  );
  const [monthlyFinancialTrends, setMonthlyFinancialTrends] = useState<any[]>(
    []
  );
  const [returnsSummary, setReturnsSummary] = useState<any>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const outstandingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/totalOutstandingInvoices`,
        { headers }
      );
      if (!outstandingRes.ok)
        throw new Error("Gagal memuat total faktur belum terbayar.");
      const outstandingData = await outstandingRes.json();
      setTotalOutstandingInvoices(outstandingData.total_outstanding_amount);

      const overdueRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/overdueInvoices`,
        { headers }
      );
      if (!overdueRes.ok)
        throw new Error("Gagal memuat faktur yang telah jatuh tempo.");
      const overdueData: OverdueInvoice[] = await overdueRes.json();
      setOverdueInvoices(overdueData);

      const financialRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/financialSummaryByOutlet`,
        { headers }
      );
      if (!financialRes.ok)
        throw new Error("Gagal memuat ringkasan keuangan outlet.");
      const financialData: FinancialSummary[] = await financialRes.json();
      setFinancialSummary(financialData);

      const trendsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/monthlyFinancialTrends`,
        { headers }
      );
      if (!trendsRes.ok) throw new Error("Gagal memuat tren keuangan bulanan.");
      const trendsData = await trendsRes.json();
      setMonthlyFinancialTrends(trendsData);

      const returnsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/returnsSummary`,
        { headers }
      );
      if (!returnsRes.ok) throw new Error("Gagal memuat ringkasan retur.");
      const returnsData = await returnsRes.json();
      setReturnsSummary(returnsData);

      dispatch(
        showSuccessToast({
          message: "Data berhasil dimuat.",
          isDarkMode: false,
        })
      );
    } catch (err: any) {
      dispatch(
        showErrorToast({
          message: err.message || "Terjadi kesalahan saat memuat data.",
          isDarkMode: false,
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

      {/* Total Outstanding Invoices */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Total Faktur Belum Terbayar
        </h2>
        <div className="p-6 bg-red-50 rounded-md text-center">
          <p className="text-3xl font-bold text-red-800">
            {totalOutstandingInvoices !== null
              ? totalOutstandingInvoices
              : "Loading..."}
          </p>
          <p className="text-lg text-gray-600 mt-2">
            Jumlah total faktur yang belum terbayar
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
                <th className="px-4 py-2 border border-gray-200">
                  Hari Terlambat
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
                      {invoice.faktur_id}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.sisa_tagihan > 0 ? "Belum Dibayar" : "Lunas"}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.tanggal_jatuh_tempo}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.jumlah_tagihan}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {invoice.overdue_days}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4">
                    No overdue invoices
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Financial Summary by Outlet */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Ringkasan Keuangan Outlet
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-200">Outlet</th>
                <th className="px-4 py-2 border border-gray-200">Pendapatan</th>
                <th className="px-4 py-2 border border-gray-200">
                  Total Hutang
                </th>
                <th className="px-4 py-2 border border-gray-200">
                  Saldo Tersisa
                </th>
              </tr>
            </thead>
            <tbody>
              {financialSummary.length > 0 ? (
                financialSummary.map((summary, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-2 border border-gray-200">
                      {summary.outlet_name}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {summary.total_revenue}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {summary.total_debt}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {summary.remaining_balance}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4">
                    No financial data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monthly Financial Trends */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Tren Keuangan Bulanan
        </h2>
        <pre>{JSON.stringify(monthlyFinancialTrends, null, 2)}</pre>
      </section>

      {/* Returns Summary */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
          Ringkasan Retur
        </h2>
        <pre>{JSON.stringify(returnsSummary, null, 2)}</pre>
      </section>
    </div>
  );
};

export default DashboardBendahara;
