"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";

interface Product {
  id: string;
  nama: string;
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
    harga: "",
    komposisi: "",
    deskripsi: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();

  // Assuming you have a way to determine if the user is in dark mode
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  ); // Replace with actual dark mode state if necessary

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        dispatch(
          showErrorToast({
            message: "No token found. Please log in.",
            isDarkMode,
          })
        );
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
        dispatch(
          showErrorToast({
            message: "Error fetching products. Please try again.",
            isDarkMode,
          })
        );
      }
    };

    fetchProducts();
  }, [token, dispatch, isDarkMode]);

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

  // Format harga with thousand separators
  const formatHarga = (value: string) => {
    const numberValue = value.replace(/[^\d]/g, ""); // Remove non-digit characters
    return new Intl.NumberFormat("id-ID").format(Number(numberValue));
  };

  // Handle harga input change
  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // Remove non-digit characters
    setNewProduct({ ...newProduct, harga: rawValue });
  };

  const handleAddProduct = async () => {
    if (!token) {
      dispatch(
        showErrorToast({
          message: "No token found. Please log in.",
          isDarkMode,
        })
      );
      return;
    }

    if (newProduct.nama && newProduct.harga) {
      try {
        const formData = new FormData();
        formData.append("nama", newProduct.nama);
        formData.append("harga", newProduct.harga); // Send raw harga without formatting
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
          harga: "",
          komposisi: "",
          deskripsi: "",
          image: null,
        });
        setImagePreview(null);
        setIsModalOpen(false);
        dispatch(
          showSuccessToast({
            message: "Product added successfully!",
            isDarkMode,
          })
        );
      } catch (err) {
        console.error(err);
        dispatch(
          showErrorToast({
            message: "Error adding product. Please try again.",
            isDarkMode,
          })
        );
      }
    } else {
      dispatch(
        showErrorToast({
          message: "Please fill in all the required fields!",
          isDarkMode,
        })
      );
    }
  };

  return (
    <div className="pl-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Produk</h2>
        <Button
          className=""
          variant="flat"
          color="primary"
          onPress={() => setIsModalOpen(true)}
        >
          Tambah Produk
        </Button>
      </div>

      {/* Product Grid */}
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {products.map((product) => {
          const primaryImage =
            product.images?.find((img) => img.isPrimary) || product.images?.[0];
          return (
            <Link key={product.id} href={`/products/${product.id}`} passHref>
              <Card className="w-full">
                {/* Product Image */}
                <CardBody className="overflow-visible p-0">
                  <img
                    src={
                      primaryImage
                        ? primaryImage.url
                        : "/images/default-product.png"
                    }
                    alt={product.nama}
                    className="w-full h-[140px] object-cover rounded-lg shadow-sm"
                  />
                </CardBody>

                {/* Product Details */}
                <CardFooter>
                  <div className="flex flex-col justify-between w-full">
                    <b className="truncate max-w-[140px]">{product.nama}</b>
                    <p className="text-sm font-medium mt-1">
                      Rp. {new Intl.NumberFormat("id-ID").format(product.harga)}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Tambah Produk</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
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
                  <span
                    role="img"
                    aria-label="camera"
                    className="text-gray-500 text-2xl mb-2"
                  >
                    📷
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>

              {/* Form Inputs */}
              <Input
                label="Nama Produk"
                placeholder="Masukkan nama produk"
                value={newProduct.nama}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, nama: e.target.value })
                }
              />
              <Input
                label="Harga"
                placeholder="Masukkan harga produk"
                value={`Rp. ${formatHarga(newProduct.harga)}`}
                onChange={handleHargaChange}
              />
              <Textarea
                label="Komposisi"
                placeholder="Masukkan komposisi"
                value={newProduct.komposisi}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, komposisi: e.target.value })
                }
              />
              <Textarea
                label="Deskripsi"
                placeholder="Masukkan deskripsi"
                value={newProduct.deskripsi}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, deskripsi: e.target.value })
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onPress={() => setIsModalOpen(false)}
              className="mr-2"
            >
              Batal
            </Button>
            <Button color="primary" onPress={handleAddProduct}>
              Tambah Produk
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductsPage;
