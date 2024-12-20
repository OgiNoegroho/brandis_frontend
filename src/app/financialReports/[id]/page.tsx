"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  Button,
  Divider
} from "@nextui-org/react";
import { PhoneCall, MapPin } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

type DistributionTableEntry = {
  distribusi_id: number;
  distribusi_created_at: string;
  faktur_id: string;
};

type DistributionDetailEntry = {
  batch_id: number;
  batch_name: string;
  product_name: string;
  quantity: number;
};

type FakturEntry = {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  outlet_name: string;
  outlet_address: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  payment_status: "Lunas" | "Menunggu";
};

type Outlet = {
  id: string;
  nama: string;
  alamat: string;
  nomor_telepon: string;
};

const FinancialReportsDetails: React.FC = () => {
  const { id } = useParams();
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [distributions, setDistributions] = useState<DistributionTableEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<
    DistributionDetailEntry[] | null
  >(null);
  const [fakturData, setFakturData] = useState<FakturEntry[] | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  // Fetch outlet details
  const fetchOutletDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3008/api/outlet/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch outlet details");

      const outletData: Outlet = await response.json();
      setSelectedOutlet(outletData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  useEffect(() => {
    if (id) {
      fetchOutletDetails();
      fetchDistributions(); // Fetch distributions after outlet details
    }
  }, [id, token]);

  const fetchDistributions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3008/api/distribusi/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch distributions");

      const data: DistributionTableEntry[] = await response.json();
      setDistributions(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (distributionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3008/api/distribusi/detail/${distributionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch distribution details");

      const data: DistributionDetailEntry[] = await response.json();
      setDetailData(data);
    } catch (error) {
      console.error("Error fetching distribution details:", error);
    }
  };

  const handleViewFaktur = async (distributionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3008/api/faktur/${distributionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch invoice details");

      const data: FakturEntry[] = await response.json();
      setFakturData(data);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  const closeDetailModal = () => setDetailData(null);
  const closeFakturModal = () => setFakturData(null);

  return (
    <div>
      {/* Outlet Details */}
      {selectedOutlet ? (
        <Card className="mb-4">
          <CardHeader>
            <h1 className="text-3xl font-bold">{selectedOutlet.nama}</h1>
          </CardHeader>
          <Divider />
          <div className="grid grid-cols-1 gap-2 p-2">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="h-5 w-5" />
              <span>{selectedOutlet.alamat}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <PhoneCall className="h-5 w-5" />
              <span>{selectedOutlet.nomor_telepon}</span>
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center text-gray-500">
          Loading outlet details...
        </div>
      )}

      <Card className="mb-4">
        <CardBody>
          <h3 className="text-lg font-semibold">Financial Report</h3>
          <Divider className="mb-2" />
          <Table aria-label="Distribution Table">
            <TableHeader>
              <TableColumn>No Faktur</TableColumn>
              <TableColumn>No Didtibusi</TableColumn>
              <TableColumn>Dibuat pada</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody items={distributions}>
              {(item) => (
                <TableRow key={item.distribusi_id}>
                  <TableCell>{item.faktur_id}</TableCell>
                  <TableCell>{item.distribusi_id}</TableCell>
                  <TableCell>
                    {new Date(item.distribusi_created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetail(item.distribusi_id)}
                      className="py-1 px-3"
                      variant="flat"
                      color="primary"
                    >
                      Detail
                    </Button>
                    <Button
                      onClick={() => handleViewFaktur(item.distribusi_id)}
                      className="py-1 px-3"
                      variant="flat"
                      color="success"
                    >
                      Lihat Faktur
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {detailData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold">Detail Distribusi</h3>
              <button
                onClick={closeDetailModal}
                className="text-red-500 hover:text-red-700"
              >
                Tutup
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b text-left px-4 py-2">Nama Batch</th>
                  <th className="border-b text-left px-4 py-2">Nama Produk</th>
                  <th className="border-b text-left px-4 py-2">Kuantitas</th>
                </tr>
              </thead>
              <tbody>
                {detailData.map((detail) => (
                  <tr key={detail.batch_id}>
                    <td className="border-t px-4 py-2">{detail.batch_name}</td>
                    <td className="border-t px-4 py-2">
                      {detail.product_name}
                    </td>
                    <td className="border-t px-4 py-2">{detail.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {fakturData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold">Detail Faktur</h3>
              <Button
                onClick={closeFakturModal}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </Button>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Nomor Faktur:</strong> {fakturData[0].invoice_number}
              </p>
              <p>
                <strong>Tanggal Faktur:</strong>{" "}
                {new Date(fakturData[0].invoice_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Tanggal Jatuh Tempo:</strong>{" "}
                {new Date(fakturData[0].due_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Outlet Name:</strong> {fakturData[0].outlet_name}
              </p>
              <p>
                <strong>Outlet Address:</strong> {fakturData[0].outlet_address}
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b text-left px-4 py-2">
                      Nama Produk
                    </th>
                    <th className="border-b text-left px-4 py-2">Kuantitas</th>
                    <th className="border-b text-left px-4 py-2">
                      Harga Satuan
                    </th>
                    <th className="border-b text-left px-4 py-2">
                      Total Harga
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fakturData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border-t px-4 py-2">
                        {item.product_name}
                      </td>
                      <td className="border-t px-4 py-2">{item.quantity}</td>
                      <td className="border-t px-4 py-2">
                        {Number(item.unit_price).toLocaleString("id-ID", {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                      <td className="border-t px-4 py-2">
                        {Number(item.total_price).toLocaleString("id-ID", {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>Grand Total:</strong>{" "}
                  {Number(fakturData[0].grand_total).toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p>
                  <strong>Amount Paid:</strong>{" "}
                  {Number(fakturData[0].amount_paid).toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p>
                  <strong>Balance Due:</strong>{" "}
                  {Number(fakturData[0].balance_due).toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p>
                  <strong>Status Pembayaran:</strong>{" "}
                  {fakturData[0].payment_status}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReportsDetails;
