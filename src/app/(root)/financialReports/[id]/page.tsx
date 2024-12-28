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
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "@nextui-org/react";
import { PhoneCall, MapPin } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";

type DistributionTableEntry = {
  distribusi_id: number;
  distribusi_created_at: string;
  faktur_id: string;
  status_pembayaran: string;
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
  total_quantity: number;
  unit_price: number;
  total_price: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  payment_status: "Lunas" | "Menunggu";
  distribusi_id: number;
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
  const [detailData, setDetailData] = useState<
    DistributionDetailEntry[] | null
  >(null);
  const [fakturData, setFakturData] = useState<FakturEntry[] | null>(null);
  const [amountPaidInput, setAmountPaidInput] = useState<string>("");
  const [isAmountUpdating, setIsAmountUpdating] = useState(false);

  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchOutletDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/outlet/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Gagal mengambil detail outlet");

      const outletData: Outlet = await response.json();
      setSelectedOutlet(outletData);
    } catch (error) {
      dispatch(
        showErrorToast({
          message:
            error instanceof Error ? error.message : "sebuah kesalahan terjadi",
          isDarkMode,
        })
      );
    }
  };

  useEffect(() => {
    if (id) {
      fetchOutletDetails();
      fetchLaporanDistributions();
    }
  }, [id, token]);

  const fetchLaporanDistributions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/laporanOutlet/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("gagal mengambil data distribusi");

      const data: DistributionTableEntry[] = await response.json();
      setDistributions(data);
    } catch (error) {
      dispatch(
        showErrorToast({
          message:
            error instanceof Error ? error.message : "sebuah kesalahan terjadi",
          isDarkMode,
        })
      );
    }
  };

  const handleViewDetail = async (distributionId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/distribusi/detail/${distributionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Gagal mengambil detail distribusi");

      const data: DistributionDetailEntry[] = await response.json();
      setDetailData(data);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal mengambil detail distribusi",
          isDarkMode,
        })
      );
    }
  };

  const handleViewFaktur = async (distributionId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/faktur/${distributionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Gagal mengambil detail faktur");

      const data: FakturEntry[] = await response.json();
      setFakturData(data);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal mengambil detail faktur",
          isDarkMode,
        })
      );
    }
  };

  const handleAmountUpdate = async (fakturId: string) => {
    setIsAmountUpdating(true);
    try {
      const encodedFakturId = encodeURIComponent(fakturId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/faktur/${encodedFakturId}/jumlah-dibayar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jumlah_dibayar: Number(amountPaidInput) }),
        }
      );

      if (!response.ok) throw new Error("Jumlah dibayar gagal diperbarui");

      // Refresh faktur data
      const distribusiId = fakturData?.[0]?.distribusi_id;
      if (distribusiId) {
        await handleViewFaktur(distribusiId); // Refresh modal
      }

      // Refresh the distributions table
      await fetchLaporanDistributions();

      setAmountPaidInput("");

      dispatch(
        showSuccessToast({
          message: "Jumlah dibayar berhasil diperbarui",
          isDarkMode,
        })
      );
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal memperbarui jumlah dibayar",
          isDarkMode,
        })
      );
    } finally {
      setIsAmountUpdating(false);
    }
  };

  const closeDetailModal = () => {
    setDetailData(null);
  };

  const closeFakturModal = () => {
    setFakturData(null);
  };

  const getStatus = (status: string) => {
    switch (status) {
      case "Lunas":
        return (
          <Chip
            color="success"
            variant="flat"
            className="capitalize text-green-500 bg-green-50"
          >
            Lunas
          </Chip>
        );
      case "Menunggu":
        return (
          <Chip
            color="warning"
            variant="flat"
            className="capitalize text-yellow-500 bg-yellow-50"
          >
            Menunggu
          </Chip>
        );
      default:
        return (
          <Chip
            color="danger"
            variant="flat"
            className="capitalize text-red-500 bg-red-50"
          >
            Belum Bayar
          </Chip>
        );
    }
  };

  return (
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
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
        <p>Loading outlet details...</p>
      )}

      <Card className="mb-4">
        <CardBody>
          <h3 className="text-lg font-semibold">Laporan Outlet</h3>
          <Divider className="mb-2" />
          <Table aria-label="Distribution Table">
            <TableHeader>
              <TableColumn>No Faktur</TableColumn>
              <TableColumn>No Distribusi</TableColumn>
              <TableColumn>Dibuat pada</TableColumn>
              <TableColumn>Status Pembayaran</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody items={distributions}>
              {(item) => (
                <TableRow key={item.distribusi_id}>
                  <TableCell>{item.faktur_id}</TableCell>
                  <TableCell>{item.distribusi_id}</TableCell>
                  <TableCell>
                    {formatDate(item.distribusi_created_at)}
                  </TableCell>
                  <TableCell>{getStatus(item.status_pembayaran)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetail(item.distribusi_id)}
                      className="mr-2"
                      size="sm"
                      variant="flat"
                      color="primary"
                    >
                      Detail
                    </Button>
                    <Button
                      onClick={() => handleViewFaktur(item.distribusi_id)}
                      size="sm"
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

      {/* Detail Modal */}
      <Modal isOpen={!!detailData} onClose={closeDetailModal} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail Distribusi
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Detail distribusi table">
                  <TableHeader>
                    <TableColumn>Nama Batch</TableColumn>
                    <TableColumn>Nama Produk</TableColumn>
                    <TableColumn>Kuantitas</TableColumn>
                  </TableHeader>
                  <TableBody items={detailData || []}>
                    {(item) => (
                      <TableRow key={item.batch_id}>
                        <TableCell>{item.batch_name}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Faktur Modal */}
      <Modal
        isOpen={!!fakturData}
        onClose={closeFakturModal}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detail Faktur
              </ModalHeader>
              <ModalBody>
                {fakturData && fakturData.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p>
                          <strong>Nomor Faktur:</strong>{" "}
                          {fakturData[0].invoice_number}
                        </p>
                        <p>
                          <strong>Tanggal Faktur:</strong>{" "}
                          {formatDate(fakturData[0].invoice_date)}
                        </p>
                        <p>
                          <strong>Tanggal Jatuh Tempo:</strong>{" "}
                          {formatDate(fakturData[0].due_date)}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Nama Outlet:</strong>{" "}
                          {fakturData[0].outlet_name}
                        </p>
                        <p>
                          <strong>Alamat Outlet:</strong>{" "}
                          {fakturData[0].outlet_address}
                        </p>
                      </div>
                    </div>

                    <Table
                      aria-label="Faktur details table"
                      selectionMode="none"
                    >
                      <TableHeader>
                        <TableColumn>Nama Produk</TableColumn>
                        <TableColumn>Kuantitas</TableColumn>
                        <TableColumn>Harga Satuan</TableColumn>
                        <TableColumn>Total Harga</TableColumn>
                      </TableHeader>
                      <TableBody items={fakturData}>
                        {(item: FakturEntry) => (
                          <TableRow
                            key={`${item.invoice_number}-${item.product_name}`}
                          >
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.total_quantity}</TableCell>
                            <TableCell>
                              {Number(item.unit_price).toLocaleString("id-ID", {
                                minimumFractionDigits: 0,
                              })}
                            </TableCell>
                            <TableCell>
                              {Number(item.total_price).toLocaleString(
                                "id-ID",
                                {
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    <div className="mt-6 border-t pt-4">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <p className="text-lg font-semibold">
                              Informasi Pembayaran
                            </p>
                            <p className="mt-2">
                              <strong>Total Keseluruhan:</strong>{" "}
                              {Number(fakturData[0].grand_total).toLocaleString(
                                "id-ID",
                                {
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </p>
                            <p>
                              <strong>Jumlah Dibayar:</strong>{" "}
                              {Number(fakturData[0].amount_paid).toLocaleString(
                                "id-ID",
                                {
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </p>
                            <p>
                              <strong>Sisa Pembayaran:</strong>{" "}
                              {Number(fakturData[0].balance_due).toLocaleString(
                                "id-ID",
                                {
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </p>

                            {fakturData[0].amount_paid <
                              fakturData[0].grand_total && (
                              <div className="space-y-2 mt-2">
                                <p>
                                  <strong>Update Jumlah Dibayar</strong>
                                </p>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={amountPaidInput}
                                    onValueChange={setAmountPaidInput}
                                    placeholder="Masukkan Jumlah"
                                    min={0}
                                    className="max-w-[200px]"
                                  />
                                  <Button
                                    color="primary"
                                    variant="flat"
                                    isLoading={isAmountUpdating}
                                    onPress={() =>
                                      handleAmountUpdate(
                                        fakturData[0].invoice_number
                                      )
                                    }
                                  >
                                    Update
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-lg font-semibold">
                              Status Pembayaran
                            </p>
                            <p className="mt-2">
                              <strong>Status Saat Ini:</strong>{" "}
                              <span
                                className={`font-medium ${
                                  fakturData[0].payment_status === "Lunas"
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {fakturData[0].payment_status}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FinancialReportsDetails;