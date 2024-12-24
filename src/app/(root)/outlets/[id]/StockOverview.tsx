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
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

// Stock data (with price) from /stock-overview
interface StockOverview {
  produk_id: number;
  nama_produk: string;
  harga_produk: number;
  kuantitas_stok: number;
}

// Sale data to display in the sales table
interface Sale {
  penjualan_id: number;
  product_name: string;
  kuantitas_terjual: number;
  dibuat_pada: string;
}

// Product data (without price) from /stock-overview-without-price
interface ProductSelect {
  produk_id: number;
  nama_produk: string;
  kuantitas_stok: number;
}

// Sale submission data to handle the sale
interface SaleSubmission {
  outlet_id: string;
  saleDetails: {
    product_id: number;
    kuantitas_terjual: number;
  }[];
}

const StockOverview = ({ outletId }: { outletId: string }) => {
  const [stockData, setStockData] = useState<StockOverview[]>([]); // With price
  const [productSelectData, setProductSelectData] = useState<ProductSelect[]>(
    []
  ); // Without price
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantitySold, setQuantitySold] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const token = useAppSelector((state: RootState) => state.auth.token);


    const formatDateTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  // Fetch stock data (with price)
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3008/api/outlet/${outletId}/stock-overview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch stock data");

        const data: StockOverview[] = await response.json();
        setStockData(data);
      } catch (err) {
        setError("Error fetching stock data");
      }
    };
    if (outletId) fetchStockData();
  }, [outletId, token]);

  // Fetch product select data (without price)
  useEffect(() => {
    const fetchProductSelectData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3008/api/outlet/${outletId}/stock-overview-without-price`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error("Failed to fetch product select data");

        const data: ProductSelect[] = await response.json();
        setProductSelectData(data);
      } catch (err) {
        setError("Error fetching product select data");
      }
    };
    if (outletId) fetchProductSelectData();
  }, [outletId, token]);

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3008/api/sales/${outletId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch sales data");

        const data: Sale[] = await response.json();
        setSalesData(data);
      } catch (err) {
        setError("Error fetching sales data");
      }
    };
    if (outletId) fetchSalesData();
  }, [outletId, token]);

  // Handle sale submission
  const handleSaleSubmit = async () => {
    setError(null);
    if (selectedProduct && quantitySold && parseInt(quantitySold) > 0) {
      setIsSubmitting(true);
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

        const response = await fetch(`http://localhost:3008/api/sales`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(saleSubmission),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.message || "An error occurred while creating the sale."
          );
        }

        const updatedSales = await response.json();
        // Check if the response is an array or a single object
        if (Array.isArray(updatedSales)) {
          setSalesData((prevSales) => [...prevSales, ...updatedSales]);
        } else {
          setSalesData((prevSales) => [...prevSales, updatedSales]);
        }

        setQuantitySold("");
        setSelectedProduct(null);
        setModalVisible(false);
      } catch (err: any) {
        setError(err.message || "Error submitting sale.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError("Please select a product and enter a valid quantity.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stock Overview Table */}
      <div>
        <h3 className="text-lg font-semibold">Stock Overview</h3>
        <Divider className="my-2" />
        <Table aria-label="Stock levels for each product">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Price per Product</TableColumn>
            <TableColumn>Quantity</TableColumn>
          </TableHeader>
          <TableBody>
            {stockData.map((item) => (
              <TableRow key={item.produk_id}>
                <TableCell>{item.nama_produk}</TableCell>
                <TableCell>
                  {item.harga_produk
                    ? `Rp. ${item.harga_produk.toLocaleString("id-ID")}`
                    : "N/A"}
                </TableCell>
                <TableCell>{item.kuantitas_stok}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sales Data Table */}
      <div>
        <h3 className="text-lg font-semibold">Sales Overview</h3>
        <Divider className="my-2" />
        <Button color="primary" onClick={() => setModalVisible(true)}>
          Add Sale
        </Button>
        <Table aria-label="Sales transactions">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Quantity Sold</TableColumn>
            <TableColumn>Sale Date</TableColumn>
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

      {/* Add Sale Modal */}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <ModalContent>
          <ModalHeader>
            <Button id="modal-title" className="text-lg font-semibold mb-2">
              Add Sale
            </Button>
          </ModalHeader>
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
              onClick={handleSaleSubmit}
              isDisabled={isSubmitting || !selectedProduct || !quantitySold}
            >
              {isSubmitting ? "Submitting..." : "Submit Sale"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StockOverview;
