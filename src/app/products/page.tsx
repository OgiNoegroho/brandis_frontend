"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface Product {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  komposisi: string;
  deskripsi: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  images?: { url: string; isPrimary?: boolean }[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nama: "",
    kategori: "",
    harga: "",
    komposisi: "",
    deskripsi: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3008/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching products. Please try again.");
      }
    };

    fetchProducts();
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setNewProduct({ ...newProduct, image: null });
    setImagePreview(null);
  };

  const handleAddProduct = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
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
          formData.append("image", newProduct.image);
        }

        const response = await fetch("http://localhost:3008/api/products", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to add product");

        const addedProduct: Product = await response.json();
        setProducts([...products, addedProduct]);
        setNewProduct({
          nama: "",
          kategori: "",
          harga: "",
          komposisi: "",
          deskripsi: "",
          image: null,
        });
        setImagePreview(null);
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
        {products.map((product) => {
          const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
          return (
            <Link href={`/productDetail/${product.id}`} key={product.id}>
              <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                <img
                  src={primaryImage ? primaryImage.url : "/images/default-product.png"}
                  alt={product.nama}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{product.nama}</h3>
                  <p className="text-sm text-gray-500">Category: {product.kategori}</p>
                  <p className="text-blue-600 font-semibold">Rp. {product.harga}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Modal for Adding Product */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">New Product</h2>
            <form className="space-y-4">
              {/* Image Upload */}
              <div className="flex flex-col items-center border-dashed border-2 border-gray-300 w-full p-4">
                {imagePreview && (
                  <div className="relative mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      X
                    </button>
                  </div>
                )}

                {!imagePreview && (
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
                </p>
              </div>

              {/* Product Form Inputs */}
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
