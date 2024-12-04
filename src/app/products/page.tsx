"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks"; // Use the typed hooks from your custom hooks file
import { RootState } from "@/redux/store"; // Import RootState for proper type-checking

// Define the Product type
interface Product {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  komposisi: string;
  deskripsi: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  images?: { url: string }[]; // Optional, depending on how images are handled
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]); // Explicitly set the type to Product[]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nama: "",
    kategori: "",
    harga: "",
    komposisi: "",
    deskripsi: "",
    image: null as File | null, // Specify that 'image' can be a File or null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview
  const [error, setError] = useState("");

  // Access the token from Redux
  const token = useAppSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3008/api/products", {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is used in the request header
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await response.json(); // Type the response as Product[]
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching products. Please try again.");
      }
    };

    fetchProducts();
  }, [token]); // Only fetch products if the token is available

  // Handle file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file)); // Display image preview
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file)); // Display image preview
    }
  };

  // Handle adding a new product
  const handleAddProduct = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      return; // Early exit if no token is available
    }

    if (newProduct.nama && newProduct.kategori && newProduct.harga) {
      try {
        const formData = new FormData();
        formData.append("nama", newProduct.nama);
        formData.append("kategori", newProduct.kategori);
        formData.append("harga", newProduct.harga);
        formData.append("komposisi", newProduct.komposisi);
        formData.append("deskripsi", newProduct.deskripsi);

        if (newProduct.image) {
          formData.append("image", newProduct.image); // Append the image file to the FormData
        }

        const response = await fetch("http://localhost:3008/api/products", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the request header
          },
          body: formData, // Send the FormData directly
        });

        if (!response.ok) throw new Error("Failed to add product");

        const addedProduct: Product = await response.json(); // Type the added product response
        setProducts([...products, addedProduct]); // Update products state with the new product
        setNewProduct({
          nama: "",
          kategori: "",
          harga: "",
          komposisi: "",
          deskripsi: "",
          image: null,
        });
        setImagePreview(null); // Clear the image preview
        setIsModalOpen(false);
      } catch (err) {
        console.error(err);
        setError("Error adding product. Please try again.");
      }
    } else {
      alert("Please fill in all the required fields!");
    }
  };

  return (
    <div className="p-6">
      {/* Header and Add Product Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      {/* Display Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
           <img
  src={product.imageUrl ? product.imageUrl : "/images/default-product.png"}
  alt={product.nama}
  className="w-full h-64 object-cover"
/>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{product.nama}</h3>
              <p className="text-sm text-gray-500">Category: {product.kategori}</p>
              <p className="text-blue-600 font-semibold">Rp. {product.harga}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">New Product</h2>
            <form className="space-y-4">
              {/* Image Upload */}
              <div
                className="flex flex-col items-center border-dashed border-2 border-gray-300 w-full p-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover mb-2"
                  />
                ) : (
                  <span role="img" aria-label="camera" className="text-gray-500 text-2xl mb-2">
                    📷
                  </span>
                )}
                <p className="text-sm text-gray-500">
                  Drag image here or{" "}
                  <input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={handleImageChange}
                  />
                  <span className="underline text-blue-500 cursor-pointer">browse</span>
                </p>
              </div>

              {/* Product Form */}
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Product Name"
                value={newProduct.nama}
                onChange={(e) => setNewProduct({ ...newProduct, nama: e.target.value })}
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Category"
                value={newProduct.kategori}
                onChange={(e) => setNewProduct({ ...newProduct, kategori: e.target.value })}
              />
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Price"
                value={newProduct.harga}
                onChange={(e) => setNewProduct({ ...newProduct, harga: e.target.value })}
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Composition"
                value={newProduct.komposisi}
                onChange={(e) => setNewProduct({ ...newProduct, komposisi: e.target.value })}
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Description"
                value={newProduct.deskripsi}
                onChange={(e) => setNewProduct({ ...newProduct, deskripsi: e.target.value })}
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-600 py-2 px-4 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={handleAddProduct}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
