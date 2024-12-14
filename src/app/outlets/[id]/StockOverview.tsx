import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

// Type for Batch Data
type BatchData = {
  batchName: string;
  quantity: number;
  productionDate: string;
  expirationDate: string;
};

// Type for Product Data
type ProductData = {
  outletStocksId: string;
  productName: string;
  quantity: number;
  price: number;
  batches: BatchData[];
};

// Type for Sold Stock Entry
type SoldStockEntry = {
  productName: string;
  quantity: string;
  date: string;
};

// Type for Product Entry (for Distribution)
type ProductEntry = {
  productName: string;
  batchName: string;
  quantity: string;
  distributionDate: string;
};

type SavedDistribution = {
  invoiceCode: string;
  products: ProductEntry[];
};

interface StockOverviewProps {
  savedDistributions: SavedDistribution[]; // Received from parent or API
  fetchStockData: () => Promise<ProductData[]>; // Function to fetch stock data from API
}

const StockOverview = ({ savedDistributions, fetchStockData }: StockOverviewProps) => {
  const [stockData, setStockData] = useState<ProductData[]>([]);
  const [soldStockEntries, setSoldStockEntries] = useState<SoldStockEntry[]>([]);
  const [newSoldStock, setNewSoldStock] = useState<SoldStockEntry>({
    productName: "",
    quantity: "",
    date: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the stock data from the API or another source
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStockData(); // Fetch stock data
      setStockData(data);
    };

    fetchData();
  }, [fetchStockData]);

  // Update stock quantities based on saved distributions
  useEffect(() => {
    if (Array.isArray(savedDistributions)) {
      savedDistributions.forEach((distribution) => {
        if (Array.isArray(distribution.products)) {
          distribution.products.forEach((productEntry) => {
            updateStockQuantity(productEntry);
          });
        }
      });
    }
  }, [savedDistributions]);

  const updateStockQuantity = (productEntry: ProductEntry) => {
    // Find the stock item that matches the product name and batch name
    const stockItem = stockData.find((item) => item.productName === productEntry.productName);
    if (stockItem) {
      const batch = stockItem.batches.find((batch) => batch.batchName === productEntry.batchName);
      if (batch && batch.quantity >= Number(productEntry.quantity)) {
        batch.quantity -= Number(productEntry.quantity); // Reduce the batch quantity
      }
    }
  };

  const handleAddSoldStock = () => {
    if (!newSoldStock.productName || !newSoldStock.quantity || !newSoldStock.date) {
      return; // Don't add if any field is empty
    }
    setSoldStockEntries([...soldStockEntries, newSoldStock]);
    setNewSoldStock({ productName: "", quantity: "", date: "" });
    setIsModalOpen(false);
  };

  const handleSaveSoldStock = () => {
    console.log("Sold stock saved:", soldStockEntries);
    setSoldStockEntries([]); // Clear sold stock entries after saving
  };

  return (
    <div className="space-y-6">
      {/* Stock Overview Table */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Stock Overview</h3>
        <Table aria-label="Stock levels for each product">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Price per Product</TableColumn>
            <TableColumn>Quantity</TableColumn>
          </TableHeader>
          <TableBody>
            {stockData.map((item) => (
              <TableRow key={item.outletStocksId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sold Stock Table */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Sold Stock</h3>

        {/* Add Product Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Product
          </button>
        </div>

        {/* Modal for Adding Sold Stock */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="border-b px-6 py-4">
                <h3 className="text-xl font-semibold">Add Sold Stock</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                {/* Dropdown for Product Name */}
                <select
                  value={newSoldStock.productName}
                  onChange={(e) => setNewSoldStock({ ...newSoldStock, productName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Product</option>
                  {stockData.map((item) => (
                    <option key={item.outletStocksId} value={item.productName}>
                      {item.productName}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Quantity"
                  value={newSoldStock.quantity}
                  onChange={(e) => setNewSoldStock({ ...newSoldStock, quantity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="date"
                  value={newSoldStock.date}
                  onChange={(e) => setNewSoldStock({ ...newSoldStock, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="border-t px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSoldStock}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sold Stock Entries Table */}
        {soldStockEntries.length > 0 && (
          <>
            <Table aria-label="Sold stock entries">
              <TableHeader>
                <TableColumn>Product Name</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody>
                {soldStockEntries.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveSoldStock}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Sold Stock
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockOverview;
