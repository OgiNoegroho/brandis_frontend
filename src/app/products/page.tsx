"use client";
import React, { useState } from "react";

const initialProducts = [
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
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    expiryDate: "",
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price) {
      setProducts([
        ...products,
        {
          ...newProduct,
          id: products.length + 1,
          imageUrl: "/images/default-product.png", // Default image placeholder
        },
      ]);
      setNewProduct({ id: "", name: "", category: "", price: "", expiryDate: "" });
      setIsModalOpen(false);
    } else {
      alert("Mohon isi semua data produk!");
    }
  };

  return (
    <div className="p-6">
      {/* Header with Add Product Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product</h2>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500">Kategori: {product.category}</p>
              <p className="text-blue-600 font-semibold">Rp. {product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">New Product</h2>
            <form className="space-y-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 border-dashed border-2 border-gray-300 flex items-center justify-center rounded-lg mb-2">
                  <span role="img" aria-label="camera" className="text-gray-500 text-2xl">
                    📷
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Drag image here or{" "}
                  <span className="text-blue-500 cursor-pointer">Browse image</span>
                </p>
              </div>

              {/* Input Nama Produk */}
              <div>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>

              {/* Input ID Produk */}
              <div>
                <input
                  type="text"
                  placeholder="Enter product ID"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.id}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, id: e.target.value })
                  }
                />
              </div>

              {/* Dropdown Kategori */}
              <div>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <option value="">Select product category</option>
                  <option value="Food">Food</option>
                  <option value="Drink">Drink</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Input Harga */}
              <div>
                <input
                  type="number"
                  placeholder="Enter buying price"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>

              {/* Input Tanggal Expiry */}
              <div>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.expiryDate}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, expiryDate: e.target.value })
                  }
                />
              </div>
            </form>

            {/* Footer Modal */}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                onClick={handleAddProduct}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;