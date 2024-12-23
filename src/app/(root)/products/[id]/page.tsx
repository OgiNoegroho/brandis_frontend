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
        dispatch(showErrorToast({ message: "No token found. Please log in.",
            isDarkMode, }));
        return;
      }

      setLoading(true);
      setProduct(null);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:3008/api/products/${id}`,
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
        `http://localhost:3008/api/products/${id}/replace-image`,
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
      const response = await fetch(`http://localhost:3008/api/products/${id}`, {
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
      const response = await fetch(`http://localhost:3008/api/products/${id}`, {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{formData.nama}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            src={
              primaryImage ? primaryImage.url : "/images/default-product.png"
            }
            alt={formData.nama}
            className="w-full h-64 object-cover cursor-pointer rounded-lg shadow-md transition-transform hover:scale-[1.02]"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
          <h3 className="text-xl font-semibold">Product Information</h3>
          <p className="text-2xl text-blue-600 font-semibold">
            Rp. {formData.harga.toLocaleString()}
          </p>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Composition</h4>
            <p className="text-gray-700">{formData.komposisi}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Description</h4>
            <p className="text-gray-700">{formData.deskripsi}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6">
        <Button color="secondary" onPress={() => setEditMode(true)}>
          Edit
        </Button>
        <Button color="danger" onPress={() => setShowDeleteConfirmation(true)}>
          Delete
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editMode} onClose={() => setEditMode(false)}>
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalBody>
            <Input
              label="Product Name"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              className="mb-4"
            />
            <Input
              label="Price"
              type="number"
              name="harga"
              value={formData.harga.toString()}
              onChange={handleInputChange}
              className="mb-4"
            />
            <Textarea
              label="Composition"
              name="komposisi"
              value={formData.komposisi}
              onChange={handleInputChange}
              rows={3}
              className="mb-4"
            />
            <Textarea
              label="Description"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              rows={3}
              className="mb-4"
            />
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setEditMode(false)}>Cancel</Button>
            <Button onPress={handleEdit} disabled={loading} color="primary">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this product?</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setShowDeleteConfirmation(false)}>
              Cancel
            </Button>
            <Button onPress={handleDelete} disabled={loading} color="danger">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Image Upload Modal */}
      <Modal
        isOpen={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
      >
        <ModalContent>
          <ModalHeader>Upload New Image</ModalHeader>
          <ModalBody>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) handleImageReplace(e.target.files[0]);
              }}
              className="block w-full"
            />
            {isImageUploading && <p>Uploading image...</p>}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setShowImageUploadModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductDetail;
