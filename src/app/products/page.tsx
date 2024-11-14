"use client";
import React, { useState } from "react";
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: 'Brandis Natural Drink "MIX"',
    category: "Drink",
    price: "30,000",
    imageUrl: "/images/product1.png",
  },
  {
    id: 2,
    name: "Frozen Nugget Tempe",
    category: "Food",
    price: "70,000",
    imageUrl: "/images/product2.png",
  },
  {
    id: 3,
    name: "Brandis Light",
    category: "Drink",
    price: "10,000",
    imageUrl: "/images/product3.png",
  },
  {
    id: 4,
    name: 'Brandis Natural Drink "TEMULAWAK"',
    category: "Drink",
    price: "20,000",
    imageUrl: "/images/product4.png",
  },
  {
    id: 5,
    name: 'Brandis Natural Drink "JAHE MERAH"',
    category: "Drink",
    price: "20,000",
    imageUrl: "/images/product5.png",
  },
  {
    id: 6,
    name: 'Brandis Natural Drink "KUNYIT PUTIH"',
    category: "Drink",
    price: "20,000",
    imageUrl: "/images/product6.png",
  },
];

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productId: "",
    category: "",
    price: "",
    expiryDate: "",
  });

  const handleAddProduct = () => {
    console.log("Product added:", newProduct);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header with Add Product Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product</h2>
        <Button variant="flat" color="primary" onPress={() => setIsModalOpen(true)}>
          + Tambah
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} isHoverable isPressable>
            <CardBody className="p-0">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500">Kategori: {product.category}</p>
                <p className="text-blue-600 font-semibold">Rp. {product.price}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} placement="center" size="xs">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">New Product</ModalHeader>
          <ModalBody className="flex flex-col items-center space-y-4">
            {/* Image Upload Placeholder */}
            <div className="w-20 h-20 border-dashed border-2 border-gray-300 flex items-center justify-center rounded-lg mb-2">
              <span role="img" aria-label="camera" className="text-gray-500 text-2xl">
                📷
              </span>
            </div>
            <p className="text-sm text-gray-500">Drag image here or <span className="text-blue-500 cursor-pointer">Browse image</span></p>
            
            {/* Input Fields */}
            <Input
              label="Product Name"
              placeholder="Enter product name"
              fullWidth
              size="sm"
              value={newProduct.productName}
              onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
            />
            <Input
              label="Product ID"
              placeholder="Enter product ID"
              fullWidth
              size="sm"
              value={newProduct.productId}
              onChange={(e) => setNewProduct({ ...newProduct, productId: e.target.value })}
            />
            <Input
              label="Category"
              placeholder="Select product category"
              fullWidth
              size="sm"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <Input
              label="Price"
              placeholder="Enter buying price"
              type="number"
              fullWidth
              size="sm"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <Input
              label="Expiry Date"
              placeholder="Enter expiry date"
              type="date"
              fullWidth
              size="sm"
              value={newProduct.expiryDate}
              onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" color="default" onPress={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button color="primary" onPress={handleAddProduct}>
              Add Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductsPage;
