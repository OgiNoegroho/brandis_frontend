import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Input,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";

// Types
type Product = {
  product_id: number;
  product_name: string;
};

type Batch = {
  batch_id: number;
  batch_name: string;
  kuantitas: number;
};

type NewReturn = {
  outletId: string;
  productId: number | null;
  batchId: number | null;
  quantity: number;
  reason: string;
  returnDate: string;
};

type ReturnHistory = {
  return_id: number;
  outlet_id: number;
  batch_id: number;
  quantity: number;
  reason: string;
  return_date: string;
  product_name: string;
};

interface ReturnManagementProps {
  outletId: string;
}

const ReturnManagement: React.FC<ReturnManagementProps> = ({ outletId }) => {
  // Redux
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector((state: RootState) => state.global.isDarkMode);

  // State
  const [returnData, setReturnData] = useState<ReturnHistory[]>([]);
  const [returnHistory, setReturnHistory] = useState<ReturnHistory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [newReturn, setNewReturn] = useState<NewReturn>({
    outletId,
    productId: null,
    batchId: null,
    quantity: 0,
    reason: "",
    returnDate: "",
  });

  // Utilities
  const formatDate = (date?: string | number | null) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const resetForm = () => {
    setNewReturn({
      outletId,
      productId: null,
      batchId: null,
      quantity: 0,
      reason: "",
      returnDate: new Date().toISOString().split("T")[0],
    });
  };

  // API Calls
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns/${outletId}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data produk");
      const productsList = await response.json();
      setProducts(productsList);
    } catch (error) {
      dispatch(
        showErrorToast({ message: "Gagal mengambil data produk", isDarkMode })
      );
    }
  };

  const fetchBatches = async () => {
    if (!newReturn.productId) {
      setBatches([]);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns/${newReturn.productId}/batches`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data batch");
      const batchesList = await response.json();
      setBatches(batchesList);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal mengambil data batch. Silakan coba lagi nanti.",
          isDarkMode,
        })
      );
    }
  };

  const fetchReturnHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns/${outletId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil riwayat retur");
      const history = await response.json();
      setReturnHistory(history);
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal mengambil riwayat retur. Silakan coba lagi nanti.",
          isDarkMode,
        })
      );
    }
  };

  // Event Handlers
  const handleAddReturn = () => {
    if (
      !newReturn.productId ||
      !newReturn.batchId ||
      !newReturn.quantity ||
      !newReturn.reason
    ) {
      dispatch(showErrorToast({ message: "Mohon lengkapi semua field", isDarkMode }));
      return;
    }

    const quantity = Number(newReturn.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      dispatch(showErrorToast({
        message: "Kuantitas harus berupa angka positif",
        isDarkMode,
      }));
      return;
    }

    const selectedProduct = products.find(p => p.product_id === newReturn.productId);
    const selectedBatch = batches.find(b => b.batch_id === newReturn.batchId);

    if (!selectedProduct || !selectedBatch) {
      dispatch(showErrorToast({
        message: "Pemilihan produk atau batch tidak valid",
        isDarkMode,
      }));
      return;
    }

    const newEntry: ReturnHistory = {
      return_id: Date.now(),
      product_name: selectedProduct.product_name,
      batch_id: selectedBatch.batch_id,
      quantity,
      reason: newReturn.reason,
      return_date: newReturn.returnDate,
      outlet_id: Number(outletId),
    };

    setReturnData(prev => [...prev, newEntry]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveReturns = async () => {
    if (returnData.length === 0) {
      dispatch(showErrorToast({ message: "Tidak ada retur untuk disimpan", isDarkMode }));
      return;
    }

    try {
      const returnRequestBody = returnData.map(item => ({
        outlet_id: item.outlet_id,
        batch_id: item.batch_id,
        kuantitas: item.quantity,
        alasan: item.reason,
      }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/returns`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(returnRequestBody),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Gagal menyimpan data retur");
      }

      setReturnHistory(prev => [...prev, ...returnData]);
      setReturnData([]);
      dispatch(
        showSuccessToast({ message: "Retur berhasil disimpan!", isDarkMode })
      );
    } catch (error) {
      console.error("Gagal menyimpan retur:", error);
      dispatch(
        showErrorToast({ message: "Gagal menyimpan data retur", isDarkMode })
      );
    }
  };

  // Effects
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setNewReturn(prev => ({
      ...prev,
      returnDate: currentDate,
    }));
  }, []);

  useEffect(() => {
    if (outletId) fetchProducts();
  }, [outletId, token]);

  useEffect(() => {
    fetchBatches();
  }, [newReturn.productId, token]);

  useEffect(() => {
    if (outletId) fetchReturnHistory();
  }, [outletId, token]);

  return (
    <div>
      <h3 className="text-lg font-semibold">Manajemen retur</h3>
      <Divider className="mb-2" />

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          color="success"
          variant="flat"
        >
          Retur Produk
        </Button>
      </div>

      {returnData.length > 0 && (
        <>
          <Table aria-label="Unsaved Returns">
            <TableHeader>
              <TableColumn>Nama Produk</TableColumn>
              <TableColumn>Batch</TableColumn>
              <TableColumn>Kuantitas</TableColumn>
              <TableColumn>Alasan</TableColumn>
              <TableColumn>Tanggal Retur</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {returnData.map((item) => (
                <TableRow key={item.return_id}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.batch_id}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{formatDate(item.return_date)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        setReturnData((prev) =>
                          prev.filter((r) => r.return_id !== item.return_id)
                        )
                      }
                      color="danger"
                      variant="light"
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {returnData.length > 0 && (
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSaveReturns}
                color="primary"
                variant="flat"
              >
                Simpan Retur
              </Button>
            </div>
          )}
        </>
      )}

      <h3 className="text-lg font-semibold">Riwayat retur</h3>
      <Divider className="mb-2" />
      <Table>
        <TableHeader>
          <TableColumn>Nama Produk</TableColumn>
          <TableColumn>Batch</TableColumn>
          <TableColumn>Kuantitas</TableColumn>
          <TableColumn>Alasan</TableColumn>
          <TableColumn>Tanggal Pengembalian</TableColumn>
        </TableHeader>
        <TableBody>
          {returnHistory.map((item) => (
            <TableRow key={item.return_id}>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>{item.batch_id}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>{formatDate(item.return_date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Retur Produk
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select
                    label="Nama Produk"
                    placeholder="Pilih Produk"
                    value={newReturn.productId?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Number(e.target.value)
                        : null;
                      setNewReturn((prev) => ({
                        ...prev,
                        productId: value,
                        batchId: null,
                      }));
                    }}
                  >
                    {[
                      ...new Map(
                        products.map((product) => [product.product_id, product])
                      ).values(),
                    ].map((uniqueProduct) => (
                      <SelectItem
                        key={uniqueProduct.product_id}
                        value={uniqueProduct.product_id}
                      >
                        {uniqueProduct.product_name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Batch"
                    placeholder="Pilih Batch"
                    value={newReturn.batchId?.toString() || ""}
                    onChange={(e) => {
                      setNewReturn((prev) => ({
                        ...prev,
                        batchId: Number(e.target.value),
                      }));
                    }}
                  >
                    {batches.map((batch) => (
                      <SelectItem key={batch.batch_id} value={batch.batch_id}>
                        {`${batch.batch_name} - ${batch.kuantitas}`}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    type="number"
                    label="Kuantitas"
                    placeholder="Masukkan Kuantitas"
                    value={newReturn.quantity.toString()}
                    min={1}
                    onChange={(e) => {
                      setNewReturn((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value) || 0,
                      }));
                    }}
                  />

                  <Input
                    label="Alasan"
                    placeholder="Alasan Retur"
                    value={newReturn.reason}
                    onChange={(e) => {
                      setNewReturn((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }));
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    handleAddReturn();
                    onClose();
                  }}
                >
                  Tambah
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReturnManagement;
