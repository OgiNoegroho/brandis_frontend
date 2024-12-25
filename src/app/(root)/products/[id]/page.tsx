"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";

interface Product {
  id: string;
  nama: string;
  harga: number;
  komposisi: string;
  deskripsi: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  images?: { url: string; publicId: string; isPrimary?: boolean }[];
}

const ProductDetail = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImageUploading, setImageUploading] = useState<boolean>(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    harga: 0,
    komposisi: "",
    deskripsi: "",
  });

  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );
  const dispatch = useAppDispatch(); // Use dispatch hook

   const formatPrice = (price: number): string => {
     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  const { id } = useParams();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetail = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        dispatch(
          showErrorToast({
            message: "No token found. Please log in.",
            isDarkMode,
          })
        );
        return;
      }

      setLoading(true);
      setProduct(null);
      setError("");

      try {
        const response = await fetch(
          `https://brandis-backend.vercel.app/api/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch product details");

        const data: Product = await response.json();
        setProduct(data);
        setFormData({
          nama: data.nama,
          harga: data.harga,
          komposisi: data.komposisi,
          deskripsi: data.deskripsi,
        });
      } catch (err) {
        console.error(err);
        setError("Error fetching product details. Please try again.");
        dispatch(
          showErrorToast({
            message: "Error fetching product details. Please try again.",
            isDarkMode,
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, token, dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageReplace = async (file: File) => {
    if (!token || !product) return;

    setImageUploading(true);
    setError("");

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const response = await fetch(
        `https://brandis-backend.vercel.app/api/products/${id}/replace-image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload image");

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setShowImageUploadModal(false);
      dispatch(
        showSuccessToast({
          message: "Image replaced successfully!",
          isDarkMode,
        })
      );
    } catch (err) {
      console.error(err);
      setError("Error replacing image. Please try again.");
      dispatch(
        showErrorToast({
          message: "Error replacing image. Please try again.",
          isDarkMode,
        })
      );
    } finally {
      setImageUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!token || !product) return;

    try {
      const response = await fetch(`https://brandis-backend.vercel.app/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update product");

      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      setEditMode(false);
      dispatch(
        showSuccessToast({
          message: "Product updated successfully!",
          isDarkMode,
        })
      );
    } catch (err) {
      console.error(err);
      setError("Error updating product.");
      dispatch(
        showErrorToast({ message: "Error updating product.", isDarkMode })
      );
    }
  };

  const handleDelete = async () => {
    if (!token || !product) return;

    try {
      const response = await fetch(`https://brandis-backend.vercel.app/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      router.push("/products");
      dispatch(
        showSuccessToast({
          message: "Product deleted successfully!",
          isDarkMode,
        })
      );
    } catch (err) {
      console.error(err);
      setError("Error deleting product.");
      dispatch(
        showErrorToast({ message: "Error deleting product.", isDarkMode })
      );
    }
  };

  if (loading)
    return (
      <p className="text-gray-500 text-center">Loading product details...</p>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!product)
    return <p className="text-gray-500 text-center">No product found.</p>;

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <div className="p-4 sm:p-6">
      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Image Section */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <div className="aspect-square w-full relative">
              <img
                src={
                  primaryImage
                    ? primaryImage.url
                    : "/images/default-product.png"
                }
                alt={formData.nama}
                className="w-full h-full object-cover cursor-pointer rounded-lg shadow-md transition-transform hover:scale-[1.02]"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                ref={dropdownRef}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <a
                    href={
                      primaryImage
                        ? primaryImage.url
                        : "/images/default-product.png"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    role="menuitem"
                  >
                    View Full Image
                  </a>
                  <button
                    onClick={() => {
                      setShowImageUploadModal(true);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    role="menuitem"
                  >
                    Replace Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold break-words">{formData.nama}</h2>
            <p className="text-2xl text-blue-600 font-semibold">
              Rp. {formatPrice(formData.harga)}
            </p>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Composition</h4>
              <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                {formData.komposisi}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                {formData.deskripsi}
              </p>
            </div>

            {/* Action Buttons - Below product information */}
            <div className="pt-6 flex justify-end gap-3">
              <Button
                color="warning"
                variant="flat"
                onPress={() => setEditMode(true)}
                size="lg"
                className="w-32 sm:w-40"
              >
                Edit
              </Button>
              <Button
                color="danger"
                variant="flat"
                onPress={() => setShowDeleteConfirmation(true)}
                size="lg"
                className="w-32 sm:w-40"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals remain the same */}
      <Modal isOpen={editMode} onClose={() => setEditMode(false)} size="lg">
        <ModalContent className="sm:min-w-[500px]">
          <ModalHeader>Edit Product</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Product Name"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
              />
              <Input
                label="Price"
                type="number"
                name="harga"
                value={formData.harga.toString()}
                onChange={handleInputChange}
              />
              <Textarea
                label="Composition"
                name="komposisi"
                value={formData.komposisi}
                onChange={handleInputChange}
                rows={3}
              />
              <Textarea
                label="Description"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setEditMode(false)}>Cancel</Button>
            <Button onPress={handleEdit} disabled={loading} color="primary">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <ModalContent>
          <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
          <ModalBody>
            <p className="text-gray-700">
              Apakah Anda yakin ingin menghapus produk ini?
            </p>
            <p className="text-red-600 italic mt-2">
              <strong>Catatan:</strong> Produk yang telah digunakan dalam proses
              produksi atau transaksi mungkin tidak dapat dihapus untuk menjaga
              integritas data.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => setShowDeleteConfirmation(false)}
              color="default"
              variant="flat"
            >
              Batal
            </Button>
            <Button
              onPress={handleDelete}
              disabled={loading}
              color="danger"
              variant="flat"
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
      >
        <ModalContent>
          <ModalHeader>Upload New Image</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) handleImageReplace(e.target.files[0]);
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {isImageUploading && (
                <p className="text-sm text-gray-600">Uploading image...</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setShowImageUploadModal(false)}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductDetail;