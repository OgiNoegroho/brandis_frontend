import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider
} from "@nextui-org/react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { showSuccessToast, showErrorToast } from "@/lib/redux/slices/toastSlice";

type StockOverview = {
  produk_id: number;
  nama_produk: string;
  harga_produk: number;
  kuantitas_stok: number;
};

type Sale = {
  penjualan_id: number;
  product_name: string;
  kuantitas_terjual: number;
  dibuat_pada: string;
};

type ProductSelect = {
  produk_id: number;
  nama_produk: string;
  kuantitas_stok: number;
};

const StockOverview: React.FC<{ outletId: string }> = ({ outletId }) => {
  const [stockData, setStockData] = useState<StockOverview[]>([]);
  const [productSelectData, setProductSelectData] = useState<ProductSelect[]>(
    []
  );
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantitySold, setQuantitySold] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  const formatDateTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // API Calls
  const fetchStockData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/outlet/${outletId}/stock-overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data stok");
      const data: StockOverview[] = await response.json();
      setStockData(data);
    } catch (err) {
      dispatch(
        showErrorToast({ message: "Gagal mengambil data stok", isDarkMode })
      );
    }
  };

  const fetchProductSelectData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/outlet/${outletId}/stock-overview-without-price`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data produk");
      const data: ProductSelect[] = await response.json();
      setProductSelectData(data);
    } catch (err) {
      dispatch(
        showErrorToast({ message: "Gagal mengambil data produk", isDarkMode })
      );
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/${outletId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Gagal mengambil data penjualan");
      const data: Sale[] = await response.json();
      setSalesData(data);
    } catch (err) {
      dispatch(
        showErrorToast({
          message: "Gagal mengambil data penjualan",
          isDarkMode,
        })
      );
    }
  };

  const handleSaleSubmit = async () => {
    if (selectedProduct && quantitySold && parseInt(quantitySold) > 0) {
      try {
        const saleSubmission = {
          outlet_id: parseInt(outletId),
          saleDetails: [
            {
              product_id: selectedProduct,
              kuantitas_terjual: parseInt(quantitySold),
            },
          ],
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sales`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(saleSubmission),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.message || "Gagal mengirim data penjualan"
          );
        }

        const updatedSales = await response.json();
        if (Array.isArray(updatedSales)) {
          setSalesData((prevSales) => [...prevSales, ...updatedSales]);
        } else {
          setSalesData((prevSales) => [...prevSales, updatedSales]);
        }

        dispatch(
          showSuccessToast({
            message: "Data penjualan berhasil disimpan!",
            isDarkMode,
          })
        );

        setQuantitySold("");
        setSelectedProduct(null);
        setModalVisible(false);
      } catch (err: any) {
        dispatch(
          showErrorToast({
            message: "Gagal mengirim data penjualan",
            isDarkMode,
          })
        );
      }
    } else {
      dispatch(
        showErrorToast({
          message: "Pilih produk dan masukkan kuantitas yang valid",
          isDarkMode,
        })
      );
    }
  };

  // Effects
  useEffect(() => {
    if (outletId) fetchStockData();
  }, [outletId, token]);

  useEffect(() => {
    if (outletId) fetchProductSelectData();
  }, [outletId, token]);

  useEffect(() => {
    if (outletId) fetchSalesData();
  }, [outletId, token]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Stok Outlet</h3>
        <Divider className="my-2" />
        <Table aria-label="Stock levels for each product">
          <TableHeader>
            <TableColumn>Nama Produk</TableColumn>
            <TableColumn>Harga per Produk</TableColumn>
            <TableColumn>Kuantitas</TableColumn>
          </TableHeader>
          <TableBody>
            {stockData.map((item) => (
              <TableRow key={item.produk_id}>
                <TableCell>{item.nama_produk}</TableCell>
                <TableCell>
                  {item.harga_produk
                    ? `Rp. ${Math.floor(item.harga_produk).toLocaleString(
                        "id-ID"
                      )}`
                    : "N/A"}
                </TableCell>
                <TableCell>{item.kuantitas_stok}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Penjualan Outlet</h3>
        <Divider className="my-2" />
        <Button
          className="mb-2"
          color="success"
          variant="flat"
          onPress={() => setModalVisible(true)}
        >
          Tambah Penjualan
        </Button>

        <Table aria-label="Sales transactions">
          <TableHeader>
            <TableColumn>Nama Produk</TableColumn>
            <TableColumn>Kuantitas Terjual</TableColumn>
            <TableColumn>Tanggal Penjualan</TableColumn>
          </TableHeader>
          <TableBody>
            {salesData.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>{sale.product_name}</TableCell>
                <TableCell>{sale.kuantitas_terjual}</TableCell>
                <TableCell>{formatDateTime(sale.dibuat_pada)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <Select
              label="Select Product"
              placeholder="Choose a product"
              selectedKeys={selectedProduct ? [`${selectedProduct}`] : []}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              renderValue={(items) => {
                const selectedItem = productSelectData.find(
                  (item) => item.produk_id === selectedProduct
                );
                return selectedItem ? (
                  <div>
                    {selectedItem.nama_produk} ({selectedItem.kuantitas_stok} in
                    stock)
                  </div>
                ) : null;
              }}
            >
              {productSelectData.map((item) => (
                <SelectItem key={item.produk_id} value={item.produk_id}>
                  {item.nama_produk} ({item.kuantitas_stok} in stock)
                </SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              label="Quantity Sold"
              placeholder="Enter quantity"
              value={quantitySold}
              onChange={(e) => setQuantitySold(e.target.value)}
              min={1}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="flat"
              onPress={handleSaleSubmit}
              isDisabled={!selectedProduct || !quantitySold}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StockOverview;
