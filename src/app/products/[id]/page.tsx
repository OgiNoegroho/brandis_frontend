// app/products/[id]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct import for dynamic routes in Next.js 13
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

const ProductDetail = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const token = useAppSelector((state: RootState) => state.auth.token);

  const { id } = useParams(); // Access dynamic route parameter 'id'

  useEffect(() => {
    if (!id) return; // If no ID is available, exit early.

    const fetchProductDetail = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      setLoading(true);
      setProduct(null); // Reset product to show loading state
      setError("");

      try {
        const response = await fetch(`http://localhost:3008/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch product details");

        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Error fetching product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, token]); // Re-run the effect when `id` or `token` changes

  if (loading) return <p className="text-gray-500 text-center">Loading product details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!product) return <p className="text-gray-500 text-center">No product found.</p>;

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{product.nama}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg shadow-md overflow-hidden">
          <img
            src={primaryImage ? primaryImage.url : "/images/default-product.png"}
            alt={product.nama}
            className="w-full h-64 object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Product Information</h3>
          <p className="text-sm text-gray-500 mb-2">Category: {product.kategori}</p>
          <p className="text-blue-600 font-semibold mb-4">Rp. {product.harga}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Composition:</strong> {product.komposisi}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>Description:</strong> {product.deskripsi}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
