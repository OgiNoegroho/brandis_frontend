"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showErrorToast, showSuccessToast } from "@/redux/slices/toastSlice";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

// Define types
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

const Bendahara: React.FC = () => {
  const [ringkasanFaktur, setRingkasanFaktur] = useState<RingkasanFaktur[]>([]);
  const [pendapatanBulanIni, setPendapatanBulanIni] = useState<number | null>(
    null
  );
  const [fakturJatuhTempo, setFakturJatuhTempo] = useState<number | null>(null);
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();

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

      // ... (rest of the fetch calls remain the same)
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "lunas":
        return "success";
      case "belum lunas":
        return "warning";
      case "terlambat":
        return "danger";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Dashboard Bendahara
      </h1>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Pendapatan Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardBody className="text-center py-8">
            <p className="text-xl text-gray-600 mb-2">Pendapatan Bulan Ini</p>
            <p className="text-3xl font-bold text-green-600">
              {pendapatanBulanIni !== null
                ? formatCurrency(pendapatanBulanIni)
                : "Loading..."}
            </p>
          </CardBody>
        </Card>

        {/* Faktur Jatuh Tempo Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardBody className="text-center py-8">
            <p className="text-xl text-gray-600 mb-2">
              Faktur Jatuh Tempo Hari Ini
            </p>
            <p className="text-3xl font-bold text-orange-600">
              {fakturJatuhTempo !== null ? fakturJatuhTempo : "Loading..."}
            </p>
          </CardBody>
        </Card>

        {/* Total Tagihan Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody className="text-center py-8">
            <p className="text-xl text-gray-600 mb-2">Total Tagihan</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(
                ringkasanFaktur.reduce(
                  (acc, curr) => acc + curr.total_tagihan,
                  0
                )
              )}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Ringkasan Faktur Table */}
      <Card className="mb-8">
        <CardHeader className="flex justify-center">
          <h2 className="text-xl font-semibold">Ringkasan Faktur Distribusi</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Ringkasan Faktur Distribusi">
            <TableHeader>
              <TableColumn>STATUS PEMBAYARAN</TableColumn>
              <TableColumn>TOTAL TAGIHAN</TableColumn>
            </TableHeader>
            <TableBody>
              {ringkasanFaktur.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip
                      color={getStatusColor(item.status_pembayaran)}
                      variant="flat"
                    >
                      {item.status_pembayaran}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatCurrency(item.total_tagihan)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Overdue Invoices Table */}
      <Card>
        <CardHeader className="flex justify-center">
          <h2 className="text-xl font-semibold">Faktur Jatuh Tempo</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Faktur Jatuh Tempo">
            <TableHeader>
              <TableColumn>ID FAKTUR</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TANGGAL JATUH TEMPO</TableColumn>
              <TableColumn>JUMLAH TAGIHAN</TableColumn>
            </TableHeader>
            <TableBody>
              {overdueInvoices.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(invoice.status_pembayaran)}
                      variant="flat"
                    >
                      {invoice.status_pembayaran}
                    </Chip>
                  </TableCell>
                  <TableCell>{invoice.tanggal_jatuh_tempo}</TableCell>
                  <TableCell>
                    {formatCurrency(invoice.jumlah_tagihan)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Bendahara;
