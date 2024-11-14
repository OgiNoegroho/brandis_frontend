import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";

type ProductEntry = {
  productName: string;
  batchName: string;
  quantity: string;
  saleDate: string;
};

const DistributionHistory = () => {
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([
    {
      productName: "Dummy Product A",
      batchName: "Batch X",
      quantity: "50",
      saleDate: "2024-10-01",
    },
    {
      productName: "Dummy Product B",
      batchName: "Batch Y",
      quantity: "100",
      saleDate: "2024-11-01",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductEntry>({
    productName: "",
    batchName: "",
    quantity: "",
    saleDate: "",
  });

  const handleAddProduct = () => {
    if (!newProduct.productName || !newProduct.batchName || !newProduct.quantity || !newProduct.saleDate) {
      return; // Don't add if any field is empty
    }
    setProductEntries([...productEntries, newProduct]);
    setNewProduct({ productName: "", batchName: "", quantity: "", saleDate: "" });
    setIsModalOpen(false);
  };

  const handleSaveDistribution = () => {
    console.log("Distribution saved:", productEntries);
    setProductEntries([]);
  };

  return (
    <div className="space-y-6">
      {/* Add New Distribution Entry Section */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">New Distribution Entry</h3>

        {/* Add Product Button - aligned to the right */}
        <div className="flex justify-end mb-4">
          <Button 
            onPress={() => setIsModalOpen(true)} variant="flat"
            color="primary"
          >
            Add Product
          </Button>
        </div>

        {/* Modal for Adding Product */}
        <Modal 
          isOpen={isModalOpen} 
          onOpenChange={setIsModalOpen}
          placement="center"
          size="sm"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Add New Product</ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Product Name"
                    placeholder="Enter product name"
                    variant="bordered"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                  />
                  <Input
                    label="Batch Name"
                    placeholder="Enter batch name"
                    variant="bordered"
                    value={newProduct.batchName}
                    onChange={(e) => setNewProduct({ ...newProduct, batchName: e.target.value })}
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                    variant="bordered"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  />
                  <Input
                    label="Distribution Date"
                    type="date"
                    variant="bordered"
                    value={newProduct.saleDate}
                    onChange={(e) => setNewProduct({ ...newProduct, saleDate: e.target.value })}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={handleAddProduct}>
                    Confirm
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Table to display added products */}
        {productEntries.length > 0 && (
          <>
            <Table aria-label="Products in this distribution entry">
              <TableHeader>
                <TableColumn>Product Name</TableColumn>
                <TableColumn>Batch</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Date</TableColumn>
              </TableHeader>
              <TableBody>
                {productEntries.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.batchName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.saleDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Save Distribution Button - aligned to the right */}
            <div className="flex justify-end mt-4">
              <Button variant="flat" color="primary" onPress={handleSaveDistribution}>
                Save Distribution
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Display Distribution History Table */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Distribution History</h2>
        <p className="mb-4">Past Distribution Records:</p>
        <Table aria-label="Distribution history for each product">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Batch</TableColumn>
            <TableColumn>Quantity Distributed</TableColumn>
            <TableColumn>Distribution Date</TableColumn>
          </TableHeader>
          <TableBody>
            {productEntries.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.batchName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.saleDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DistributionHistory;
