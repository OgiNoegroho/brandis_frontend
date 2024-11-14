import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@nextui-org/react';

type BatchData = {
  batchName: string;
  quantity: number;
  productionDate: string;
  expirationDate: string;
};

type ProductData = {
  outletStocksId: string;
  productName: string;
  quantity: number;
  price: number;
  batches: BatchData[];
};

const stockData: ProductData[] = [
  {
    outletStocksId: '1',
    productName: 'Product A',
    quantity: 50,
    price: 25.0,
    batches: [
      {
        batchName: 'Batch 1',
        quantity: 20,
        productionDate: '2024-01-10',
        expirationDate: '2024-12-31',
      },
      {
        batchName: 'Batch 2',
        quantity: 30,
        productionDate: '2024-05-15',
        expirationDate: '2024-11-15',
      },
    ],
  },
  {
    outletStocksId: '2',
    productName: 'Product B',
    quantity: 15,
    price: 40.0,
    batches: [
      {
        batchName: 'Batch 3',
        quantity: 15,
        productionDate: '2024-03-10',
        expirationDate: '2024-12-10',
      },
    ],
  },
];

const StockOverview = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product: ProductData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Add New Distribution Entry Section */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Stock Overview</h3>
        <Table aria-label="Stock levels for each product">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Price per Product</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {stockData.map((item) => (
              <TableRow key={item.outletStocksId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Button variant="flat" color="primary" onClick={() => openModal(item)}>
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedProduct && (
        <Modal isOpen={isModalOpen} onClose={closeModal} closeButton>
          <ModalContent
            style={{
              maxWidth: '80%',
              margin: 'auto',
              padding: '30px', // Added more padding
              borderRadius: '10px',
            }}
          >
            <ModalHeader>
              <h3 className="text-lg font-semibold" style={{ marginTop: '15px' }}>
                Batch Details for {selectedProduct.productName}
              </h3>
            </ModalHeader>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <Table aria-label="Batch details">
                <TableHeader>
                  <TableColumn>Batch Name</TableColumn>
                  <TableColumn>Quantity</TableColumn>
                  <TableColumn>Production Date</TableColumn>
                  <TableColumn>Expiration Date</TableColumn>
                </TableHeader>
                <TableBody>
                  {selectedProduct.batches.map((batch, index) => (
                    <TableRow key={index}>
                      <TableCell>{batch.batchName}</TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>{batch.productionDate}</TableCell>
                      <TableCell>{batch.expirationDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ModalFooter>
              <Button color="primary" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default StockOverview;
