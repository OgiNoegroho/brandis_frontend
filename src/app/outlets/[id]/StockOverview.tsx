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
    setError(null); // Clear previous error messages
    if (selectedProduct && quantitySold && parseInt(quantitySold) > 0) {
      setIsSubmitting(true);
      try {
        // Create sale submission payload in the required structure
      const saleSubmission = {
        outlet_id: parseInt(outletId), // Ensure outletId is passed as a number
        saleDetails: [
          {
            product_id: selectedProduct, // ID of the selected product
            kuantitas_terjual: parseInt(quantitySold), // Quantity sold
          },
        ],
      };


        // Send POST request to the sales API endpoint
        const response = await fetch(`http://localhost:3008/api/sales`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include authorization token
          },
          body: JSON.stringify(saleSubmission), // Serialize the payload
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse error response
          throw new Error(
            errorData?.message || "An error occurred while creating the sale."
          );
        }

        // Clear the form inputs and close the modal on successful submission
        setQuantitySold("");
        setSelectedProduct(null);
        setModalVisible(false);

        // Optionally, re-fetch sales or stock data to reflect updates
        const updatedSales = await response.json();
        setSalesData((prevSales) => [...prevSales, ...updatedSales]);
      } catch (err: any) {
        // Set error message for the user
        setError(err.message || "Error submitting sale.");
      } finally {
        setIsSubmitting(false); // Re-enable submit button
      }
    } else {
      setError("Please select a product and enter a valid quantity."); // Validation error
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
                <TableCell>{sale.dibuat_pada}</TableCell>
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
            <Button id="modal-title" className="text-lg font-semibold mb-2" >
              Add Sale
            </Button>
          </ModalHeader>
          <ModalBody>
            <Select
              label="Select Product"
              placeholder="Choose a product"
              selectedKeys={selectedProduct ? [`${selectedProduct}`] : []}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
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
