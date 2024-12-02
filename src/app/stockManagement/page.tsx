"use client";

import React from "react";
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";

type Product = {
  id: number;
  name: string;
  quantity: number;
  status: "in-stock" | "out-of-stock" | "low-stock";
};

const products: Product[] = [
  { id: 1, name: "Brandis Natural Drink 'MIX'", quantity: 43, status: "in-stock" },
  { id: 2, name: "Brandis Natural Drink 'TEMU LAWAK'", quantity: 0, status: "out-of-stock" },
  { id: 3, name: "Brandis Natural Drink 'JAHE MERAH'", quantity: 36, status: "in-stock" },
  { id: 4, name: "Brandis Natural Drink 'KUNYIT PUTIH'", quantity: 14, status: "out-of-stock" },
  { id: 5, name: "Brandis Light", quantity: 5, status: "in-stock" },
  { id: 6, name: "Brandis Frozen Nugget Tempe", quantity: 10, status: "low-stock" },
];

const StockManagement: React.FC = () => {
  const getStatus = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return <span className="text-green-600">In Stock</span>;
      case "out-of-stock":
        return <span className="text-red-600">Out of Stock</span>;
      case "low-stock":
        return <span className="text-yellow-600">Low Stock</span>;
      default:
        return null;
    }
  };

  

  return (
    
    <div className="p-8 bg-gray-50 min-h-screen">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold">Stock Management</h1>
    </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-3 gap-10 mb-10">
        <Card className="shadow-lg">
          <CardBody>
            <div className="px-3">
            <h4 className="font-semibold">Total Products</h4>
            <b>868</b>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody>
          <div className="px-3">
            <h4 className="font-semibold">Top Selling (Last 7 Days)</h4>
            <b>₹2500</b>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-lg">
          <CardBody>
          <div className="px-3">
            <h4 className="font-semibold">Low Stocks</h4>
            <b>12 Ordered, 2 Not in Stock</b>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="shadow-lg">
        <Table aria-label="Stock Management Table" className="bg-white rounded-lg">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity} Packets</TableCell>
                <TableCell>{getStatus(product.status)}</TableCell>
                <TableCell>
                  <Tooltip content="View product details">
                    {/* Updated Button Component */}
                    <Button variant="flat" color="primary">
                      Detail
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default StockManagement;