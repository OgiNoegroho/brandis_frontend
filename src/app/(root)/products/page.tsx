"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const token = useAppSelector((state: RootState) => state.auth.token);
  const role = useAppSelector((state: RootState) => state.auth.role);
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

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
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        dispatch(
          showErrorToast({
            message: "Token tidak ditemukan, silahkan login!",
            isDarkMode,
          })
        );
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Gagal mengambil produk.");

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        dispatch(
          showErrorToast({
            message: "Gagal mengambil produk, silahkan coba kembali.",
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

  const formatHarga = (value: string) => {
    const numberValue = value.replace(/[^\d]/g, "");
    return new Intl.NumberFormat("id-ID").format(Number(numberValue));
  };

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    setNewProduct({ ...newProduct, harga: rawValue });
  };

  const handleAddProduct = async () => {
    if (!token) {
      dispatch(
        showErrorToast({
          message: "Gagal menambahkan produk, silahkan coba kembali.",
          isDarkMode,
        })
      );
      return;
    }

    if (newProduct.nama && newProduct.harga) {
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("nama", newProduct.nama);
        formData.append("harga", newProduct.harga);
        formData.append("komposisi", newProduct.komposisi);
        formData.append("deskripsi", newProduct.deskripsi);

        if (newProduct.image) {
          formData.append("image", newProduct.image);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Gagal menambahkan produk");

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
            message: "Produk berhasil ditambahkan!",
            isDarkMode,
          })
        );
      } catch (err) {
        console.error(err);
        dispatch(
          showErrorToast({
            message:
              "Terjadi kesalahan saat menambah produk, Silahkan coba kembali.",
            isDarkMode,
          })
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      dispatch(
        showErrorToast({
          message: "Isi semua kolom terlebih dahulu!",
          isDarkMode,
        })
      );
    }
  };
  
  const onlyRole = role === "Pimpinan" || role === "Manajer";
  return (
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Daftar Produk</h2>

        {onlyRole && (
          <Button
            variant="flat"
            color="success"
            onPress={() => setIsModalOpen(true)}
          >
            Tambah Produk
          </Button>
        )}
      </div>

      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {products.map((product) => {
          const primaryImage =
            product.images?.find((img) => img.isPrimary) || product.images?.[0];
          return (
            <Link key={product.id} href={`/products/${product.id}`} passHref>
              <Card className="w-full h-full shadow-sm" isPressable>
                <CardBody className="overflow-hidden p-0">
                  <Image
                    alt={product.nama}
                    className="w-full object-cover h-[140px] rounded-lg" // Fixed height and rounded corners
                    src={
                      primaryImage
                        ? primaryImage.url
                        : "/images/default-product.png"
                    }
                    width={500} // Fixed width for all images
                    height={500} // Fixed height for all images
                  />
                </CardBody>
                <CardFooter className="text-left">
                  <div className="flex flex-col justify-between w-full">
                    <b className="truncate max-w-[200px]">{product.nama}</b>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">Tambah Produk</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex flex-col items-center border-dashed border-2 border-gray-300 w-full p-4">
                {imagePreview && (
                  <div className="relative mb-2">
                    <Image
                      src={imagePreview || "/images/default-product.png"}
                      alt="Preview"
                      className="w-32 h-32 object-cover"
                      width={128} // Set an appropriate width for the image
                      height={128} // Set an appropriate height for the image
                      layout="intrinsic" // Maintains aspect ratio based on width and height
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
              color="danger"
              variant="flat"
              onPress={() => setIsModalOpen(false)}
              className="mr-2"
            >
              Batal
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={handleAddProduct}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductsPage;
