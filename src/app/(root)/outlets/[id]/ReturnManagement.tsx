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

interface Product {
  product_id: number;
  product_name: string;
}

interface Batch {
  batch_id: number;
  batch_name: string;
  kuantitas: number;
}

interface NewReturn {
  outletId: string;
  productId: number | null;
  batchId: number | null;
  quantity: number;
  reason: string;
  returnDate: string;
}

interface ReturnHistory {
  return_id: number;
  outlet_id: number;
  batch_id: number;
  quantity: number;
  reason: string;
  return_date: string;
  product_name: string;
}

const ReturnManagement: React.FC<{ outletId: string }> = ({ outletId }) => {
  const dispatch = useAppDispatch();
  
    const token = useAppSelector((state: RootState) => state.auth.token);
      const isDarkMode = useAppSelector(
        (state: RootState) => state.global.isDarkMode
      );
  const [returnData, setReturnData] = useState<ReturnHistory[]>([]);
  const [returnHistory, setReturnHistory] = useState<ReturnHistory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReturn, setNewReturn] = useState<NewReturn>({
    outletId: outletId,
    productId: null,
    batchId: null,
    quantity: 0,
    reason: "",
    returnDate: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const formatDate = (date?: string | number | null) => {
    if (!date) return "N/A";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setNewReturn((prev) => ({
      ...prev,
      returnDate: currentDate,
    }));
  }, []);

  useEffect(() => {
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

        if (!response.ok) throw new Error("Failed to fetch products");
        const productsList = await response.json();
        setProducts(productsList);
      } catch (error) {
                dispatch(
                  showErrorToast({ message: "Failed to fetch products", isDarkMode })
                );
              }
            };

    if (outletId) fetchProducts();
  }, [outletId, token]);

  useEffect(() => {
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

        if (!response.ok) throw new Error("Failed to fetch batches");
        const batchesList = await response.json();
        setBatches(batchesList);
      } catch (error) {
          dispatch(
            showErrorToast({ message: "Error fetching batches. Please try again later.", isDarkMode })
          );
        }
      };

    fetchBatches();
  }, [newReturn.productId, token]);

  useEffect(() => {
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

        if (!response.ok) throw new Error("Failed to fetch return history");
        const history = await response.json();
        setReturnHistory(history);
      } catch (error) {
          dispatch(
            showErrorToast({ message: "Error fetching return history. Please try again later.", isDarkMode })
          );
        }
      };
    

    if (outletId) fetchReturnHistory();
  }, [outletId, token]);

  const handleAddReturn = () => {
    if (
      !newReturn.productId ||
      !newReturn.batchId ||
      !newReturn.quantity ||
      !newReturn.reason
    ) {
      showErrorToast({ message: "please fill all the field", isDarkMode });
      return;
    }

    const quantity = Number(newReturn.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      showErrorToast({ message: "quantity must be a positive number", isDarkMode });
      return;
    }

    const selectedProduct = products.find(
      (p) => p.product_id === newReturn.productId
    );
    const selectedBatch = batches.find((b) => b.batch_id === newReturn.batchId);

    if (!selectedProduct || !selectedBatch) {
      showErrorToast({ message: "invalid product or batch selection", isDarkMode });
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

    setReturnData((prev) => [...prev, newEntry]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewReturn({
      outletId: outletId,
      productId: null,
      batchId: null,
      quantity: 0,
      reason: "",
      returnDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveReturns = async () => {
    if (returnData.length === 0) {
      dispatch(showErrorToast({ message: "No returns to save", isDarkMode }));
      return;
    }

    try {
      const returnRequestBody = returnData.map((item) => ({
        outlet_id: item.outlet_id,
        batch_id: item.batch_id,
        kuantitas: item.quantity,
        alasan: item.reason,
      }));

      console.log("Return Request Body:", returnRequestBody);

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
        console.error("Error Response:", error);
        throw new Error(error.message || "Failed to save returns");
      }

      setReturnHistory((prev) => [...prev, ...returnData]);
      setReturnData([]);
      dispatch(
        showSuccessToast({ message: "Returns saved successfully!", isDarkMode })
      );
    } catch (error) {
      console.error("Failed to save returns:", error);
      dispatch(
        showErrorToast({ message: "Failed to save returns", isDarkMode })
      );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Return Management</h3>
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
                Save Returns
              </Button>
            </div>
          )}
        </>
      )}

      <h3 className="text-lg font-semibold">Return History</h3>
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
              <TableCell>
                {formatDate(item.return_date)}
              </TableCell>
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
                    placeholder="Select Product"
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
                    placeholder="Select Batch"
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
                    placeholder="Enter quantity"
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
                    placeholder="Enter return reason"
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
