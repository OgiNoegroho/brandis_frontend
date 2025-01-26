"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import {
  FaMoneyCheckAlt,
  FaChartPie,
  FaFileInvoiceDollar,
  FaWallet,
  FaSync,
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
  Spinner,
} from "@nextui-org/react";
import {
  showErrorToast,
  showSuccessToast,
} from "@/lib/redux/slices/toastSlice";

// Updated Types to match API response
interface OverdueInvoice {
  faktur_id: number;
  distribusi_id: number;
  tanggal_faktur: string;
  tanggal_jatuh_tempo: string;
  overdue_days: string; // Changed to string as it comes from PostgreSQL calculation
  jumlah_tagihan: string; // Changed to string as it comes as decimal string
  jumlah_dibayar: string;
  sisa_tagihan: string;
}

interface FinancialSummaryByOutlet {
  outlet_name: string;
  total_invoices: string; // Changed to string as it comes as string from PostgreSQL count
  total_tagihan: string;
  total_dibayar: string;
  total_outstanding: string;
}

interface PaymentStatusDistribution {
  status_pembayaran: string;
  jumlah_faktur: string;
  total_tagihan: string;
  total_dibayar: string;
}

// Updated helper functions to handle string inputs
const formatCurrency = (amount: string | number) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numericAmount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DashboardBendahara: React.FC = () => {
  // State with updated types
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);
  const [financialSummary, setFinancialSummary] = useState<
    FinancialSummaryByOutlet[]
  >([]);
  const [paymentDistribution, setPaymentDistribution] = useState<
    PaymentStatusDistribution[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );
  const dispatch = useAppDispatch();

  const fetchData = useCallback(async () => {
    if (!token) {
      dispatch(
        showErrorToast({
          message: "Token not found. Please log in again.",
          isDarkMode,
        })
      );
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const fetchAPI = async (url: string) => {
        const res = await fetch(url, { headers });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }
        return res.json();
      };

      const apiUrls = [
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/overdueInvoices`,
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/financialSummaryByOutlet`,
        `${process.env.NEXT_PUBLIC_API_URL}/bendahara/paymentStatusDistribution`,
      ];

      const [overdueResponse, summaryResponse, distributionResponse] =
        await Promise.all(apiUrls.map(fetchAPI));

      // Handle direct array responses
      setOverdueInvoices(overdueResponse || []);
      setFinancialSummary(summaryResponse || []);
      setPaymentDistribution(distributionResponse || []);

      dispatch(
        showSuccessToast({
          message: "Dashboard data successfully loaded",
          isDarkMode,
        })
      );
    } catch (error: any) {
      dispatch(
        showErrorToast({
          message: error.message || "Failed to load dashboard data",
          isDarkMode,
        })
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [dispatch, isDarkMode, token]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Dashboard Bendahara
        </h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isRefreshing ? (
            <Spinner size="sm" color="white" />
          ) : (
            <FaSync
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          )}
          {isRefreshing ? "Memperbarui..." : "Refresh Data"}
        </button>
      </div>

      {/* Overdue Invoices */}
      <Card className="shadow-lg mb-6">
        <CardHeader className="flex items-center">
          <FaFileInvoiceDollar className="text-xl mr-2 text-red-500" />
          <h2 className="text-lg font-semibold">Overdue Invoices</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Overdue Invoices">
            <TableHeader>
              <TableColumn>FAKTUR ID</TableColumn>
              <TableColumn>DISTRIBUSI ID</TableColumn>
              <TableColumn>TANGGAL JATUH TEMPO</TableColumn>
              <TableColumn>HARI TERLAMBAT</TableColumn>
              <TableColumn>SISA TAGIHAN</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada faktur yang jatuh tempo">
              {overdueInvoices.map((invoice) => (
                <TableRow key={invoice.faktur_id}>
                  <TableCell>{invoice.faktur_id}</TableCell>
                  <TableCell>{invoice.distribusi_id}</TableCell>
                  <TableCell>
                    {formatDate(invoice.tanggal_jatuh_tempo)}
                  </TableCell>
                  <TableCell>{parseInt(invoice.overdue_days)} hari</TableCell>
                  <TableCell>{formatCurrency(invoice.sisa_tagihan)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Financial Summary by Outlet */}
      <Card className="shadow-lg mb-6">
        <CardHeader className="flex items-center">
          <FaWallet className="text-xl mr-2 text-green-500" />
          <h2 className="text-lg font-semibold">Financial Summary by Outlet</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Financial Summary">
            <TableHeader>
              <TableColumn>OUTLET</TableColumn>
              <TableColumn>TOTAL INVOICES</TableColumn>
              <TableColumn>TOTAL TAGIHAN</TableColumn>
              <TableColumn>TOTAL DIBAYAR</TableColumn>
              <TableColumn>OUTSTANDING</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada data tersedia">
              {financialSummary.map((summary, index) => (
                <TableRow key={index}>
                  <TableCell>{summary.outlet_name}</TableCell>
                  <TableCell>{summary.total_invoices}</TableCell>
                  <TableCell>{formatCurrency(summary.total_tagihan)}</TableCell>
                  <TableCell>{formatCurrency(summary.total_dibayar)}</TableCell>
                  <TableCell>
                    {formatCurrency(summary.total_outstanding)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Payment Status Distribution */}
      <Card className="shadow-lg">
        <CardHeader className="flex items-center">
          <FaChartPie className="text-xl mr-2 text-purple-500" />
          <h2 className="text-lg font-semibold">Payment Status Distribution</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Payment Status Distribution">
            <TableHeader>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>JUMLAH FAKTUR</TableColumn>
              <TableColumn>TOTAL TAGIHAN</TableColumn>
              <TableColumn>TOTAL DIBAYAR</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Tidak ada data tersedia">
              {paymentDistribution.map((status, index) => (
                <TableRow key={index}>
                  <TableCell>{status.status_pembayaran}</TableCell>
                  <TableCell>{status.jumlah_faktur}</TableCell>
                  <TableCell>{formatCurrency(status.total_tagihan)}</TableCell>
                  <TableCell>{formatCurrency(status.total_dibayar)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardBendahara;
