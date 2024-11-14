import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

const returnData = [
  {
    returnId: "1",
    productName: "Product A",
    quantity: 5,
    reason: "Damaged",
    returnDate: "2024-11-02",
    batchName: "Batch 1"
  },
  {
    returnId: "2",
    productName: "Product B",
    quantity: 2,
    reason: "Expired",
    returnDate: "2024-11-04",
    batchName: "Batch 2"
  }
];

const ReturnManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReturn, setNewReturn] = useState({
    productName: "",
    batchName: "",
    quantity: "",
    reason: "",
    returnDate: ""
  });

  const handleRecordReturn = () => {
    if (!newReturn.productName || !newReturn.batchName || !newReturn.quantity || !newReturn.reason || !newReturn.returnDate) {
      return; // Prevent adding if any field is empty
    }
    console.log("New Return Recorded:", newReturn);
    setIsModalOpen(false);
    setNewReturn({ productName: "", batchName: "", quantity: "", reason: "", returnDate: "" });
  };

  return (
       <div className="space-y-6">
      {/* Add New Distribution Entry Section */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Stock Overview</h3>

      {/* Button to Open Modal for New Return Entry */}
      <div className="flex justify-end mb-4">
        <Button variant="flat" color="primary" onPress={() => setIsModalOpen(true)}>
          Record a New Return
        </Button>
      </div>

      {/* Return History Table */}
        <Table aria-label="Return history for each product">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Batch</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Reason</TableColumn>
            <TableColumn>Return Date</TableColumn>
          </TableHeader>
          <TableBody>
            {returnData.map((item) => (
              <TableRow key={item.returnId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.batchName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.returnDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for New Return Entry */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} placement="center" size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Record a New Return</ModalHeader>
              <ModalBody>
                <Input
                  label="Product Name"
                  placeholder="Enter product name"
                  variant="bordered"
                  value={newReturn.productName}
                  onChange={(e) => setNewReturn({ ...newReturn, productName: e.target.value })}
                />
                <Input
                  label="Batch Name"
                  placeholder="Enter batch name"
                  variant="bordered"
                  value={newReturn.batchName}
                  onChange={(e) => setNewReturn({ ...newReturn, batchName: e.target.value })}
                />
                <Input
                  label="Quantity"
                  type="number"
                  placeholder="Enter quantity"
                  variant="bordered"
                  value={newReturn.quantity}
                  onChange={(e) => setNewReturn({ ...newReturn, quantity: e.target.value })}
                />
                <Input
                  label="Reason"
                  placeholder="Enter reason for return"
                  variant="bordered"
                  value={newReturn.reason}
                  onChange={(e) => setNewReturn({ ...newReturn, reason: e.target.value })}
                />
                <Input
                  label="Return Date"
                  type="date"
                  variant="bordered"
                  value={newReturn.returnDate}
                  onChange={(e) => setNewReturn({ ...newReturn, returnDate: e.target.value })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={handleRecordReturn}>
                  Record Return
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Summary of Return Losses */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Summary of Return Losses</h3>
        <p>Total Loss: $500.00</p>
      </div>
    </div>
  );
};

export default ReturnManagement;
