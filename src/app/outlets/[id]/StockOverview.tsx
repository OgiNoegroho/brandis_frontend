import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useAppSelector } from "@/redux/hooks"; // Import the selector
import { RootState } from "@/redux/store"; // Import RootState

// Type for Product Data
type ProductData = {
  productName: string;
  quantity: number;
  price: number;
};

interface StockOverviewProps {
  outletId: string; // Pass outletId from parent (OutletDetail)
}

interface StockOverviewResponse {
  nama_produk: string;
  harga_produk: string;
  kuantitas_stok: number;
}

const StockOverview = ({ outletId }: StockOverviewProps) => {
  const [stockData, setStockData] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get token from Redux state
  const token = useAppSelector((state: RootState) => state.auth.token);

  // Fetch the stock data from the API
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:3008/api/outlet/${outletId}/stock-overview`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(`Failed to fetch stock data: ${response.status} - ${errorDetails}`);
        }

        const data: StockOverviewResponse[] = await response.json();

        // Transform the data to match ProductData structure
        const transformedData = data.map((item) => ({
          productName: item.nama_produk, // Map "nama_produk" to productName
          price: parseFloat(item.harga_produk), // Parse price as float
          quantity: item.kuantitas_stok, // Use kuantitas_stok directly as it is a number
        }));
        

        setStockData(transformedData); // Update stock data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching stock data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (outletId) {
      fetchStockData();
    }
  }, [outletId, token]); // Ensure the effect re-runs when token changes

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <div>Error: {error}</div>
      </div>
    );
  }

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
            {stockData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>Rp.{item.price.toLocaleString()}</TableCell>
                <TableCell>{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockOverview;
