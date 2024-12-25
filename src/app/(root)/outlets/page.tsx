"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

interface Outlet {
  id: string;
  nama: string;
  alamat: string;
  nomor_telepon: string;
}

interface FormData {
  outletName: string;
  address: string;
  phone: string;
}

const Outlet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

  const [formData, setFormData] = useState<FormData>({
    outletName: "",
    address: "",
    phone: "",
  });
  const [editFormData, setEditFormData] = useState<FormData>({
    outletName: "",
    address: "",
    phone: "",
  });

  const fetchOutlets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:3008/api/outlet", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOutlets(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      dispatch(
        showErrorToast({
          message: "Gagal memuat data outlet",
          isDarkMode,
        })
      );
      console.error("Error fetching outlets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, [token]);

  const validateForm = (data: FormData): string[] => {
    const errors: string[] = [];
    if (!data.outletName.trim()) errors.push("Outlet name is required");
    if (!data.address.trim()) errors.push("Address is required");
    if (!data.phone.trim()) errors.push("Phone number is required");
    if (!/^\+?[\d\s-]+$/.test(data.phone)) {
      errors.push("Invalid phone number format");
    }
    return errors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setData: React.Dispatch<React.SetStateAction<FormData>>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOutlet = async () => {
    try {
      const errors = validateForm(formData);
      if (errors.length > 0) {
        dispatch(
          showErrorToast({
            message: errors.join("\n"),
            isDarkMode,
          })
        );
        return;
      }

      if (!token) throw new Error("Authentication token not found");

      const response = await fetch("http://localhost:3008/api/outlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: formData.outletName,
          alamat: formData.address,
          nomor_telepon: formData.phone,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newOutlet = await response.json();
      setOutlets((prevOutlets) => [...prevOutlets, newOutlet]);
      setShowCreateModal(false);
      setFormData({ outletName: "", address: "", phone: "" });
      dispatch(
        showSuccessToast({
          message: "Outlet berhasil ditambahkan",
          isDarkMode,
        })
      );
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal menambahkan outlet",
          isDarkMode,
        })
      );
      console.error("Error adding outlet:", error);
    }
  };

  const handleEditOutlet = async () => {
    if (!selectedOutlet) return;

    try {
      const errors = validateForm(editFormData);
      if (errors.length > 0) {
        dispatch(
          showErrorToast({
            message: errors.join("\n"),
            isDarkMode,
          })
        );
        return;
      }

      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `http://localhost:3008/api/outlet/${selectedOutlet.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama: editFormData.outletName,
            alamat: editFormData.address,
            nomor_telepon: editFormData.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedOutlet = await response.json();
      setOutlets((prevOutlets) =>
        prevOutlets.map((outlet) =>
          outlet.id === updatedOutlet.id ? updatedOutlet : outlet
        )
      );
      setShowEditModal(false);
      setSelectedOutlet(null);
      dispatch(
        showSuccessToast({
          message: "Outlet berhasil diperbarui",
          isDarkMode,
        })
      );
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal memperbarui outlet",
          isDarkMode,
        })
      );
      console.error("Error editing outlet:", error);
    }
  };

  const handleDeleteOutlet = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this outlet?")) {
      return;
    }

    try {
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`http://localhost:3008/api/outlet/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setOutlets((prevOutlets) =>
        prevOutlets.filter((outlet) => outlet.id !== id)
      );
      dispatch(
        showSuccessToast({
          message: "Outlet berhasil dihapus",
          isDarkMode,
        })
      );
    } catch (error) {
      dispatch(
        showErrorToast({
          message: "Gagal menghapus outlet",
          isDarkMode,
        })
      );
      console.error("Error deleting outlet:", error);
    }
  };

  const handleOpenEditModal = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setEditFormData({
      outletName: outlet.nama,
      address: outlet.alamat,
      phone: outlet.nomor_telepon,
    });
    setShowEditModal(true);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/outlets/${id}`);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading outlets...</div>;
  }

  return (
    <div className="pl-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Outlet</h1>
        <Button
          variant="flat"
          color="success"
          onPress={() => setShowCreateModal(true)}
        >
          Tambah Outlet
        </Button>
      </div>

      {outlets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No outlets found. Add your first outlet to get started.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {outlets.map((outlet) => (
            <div
              key={outlet.id}
              className="flex justify-between items-center border-b p-5 hover:bg-gray-100 transition"
            >
              <div>
                <h2 className="text-lg font-semibold">{outlet.nama}</h2>
                <p className="text-sm text-gray-600">{outlet.alamat}</p>
                <p className="text-sm text-gray-600">{outlet.nomor_telepon}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onPress={() => handleViewDetails(outlet.id)}
                  variant="flat"
                  color="primary"
                >
                  Detail
                </Button>
                <Button
                  onPress={() => handleOpenEditModal(outlet)}
                  variant="flat"
                  color="warning"
                >
                  Edit
                </Button>
                <Button
                  onPress={() => {
                    setSelectedOutlet(outlet);
                    setShowDeleteModal(true);
                  }}
                  variant="flat"
                  color="danger"
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalContent>
          <ModalHeader>Tambah Outlet Baru</ModalHeader>
          <ModalBody>
            <Input
              label="Nama Outlet"
              name="outletName"
              value={formData.outletName}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
            <Input
              label="Alamat"
              name="address"
              value={formData.address}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
            <Input
              label="Nomor Telepon"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange(e, setFormData)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => setShowCreateModal(false)}
            >
              Batal
            </Button>
            <Button color="primary" variant="flat" onPress={handleAddOutlet}>
              Tambah
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      {showEditModal && selectedOutlet && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <ModalContent>
            <ModalHeader>Edit Outlet</ModalHeader>
            <ModalBody>
              <Input
                label="Nama Outlet"
                name="outletName"
                value={editFormData.outletName}
                onChange={(e) => handleInputChange(e, setEditFormData)}
              />
              <Input
                label="Alamat"
                name="address"
                value={editFormData.address}
                onChange={(e) => handleInputChange(e, setEditFormData)}
              />
              <Input
                label="Nomor Telepon"
                name="phone"
                value={editFormData.phone}
                onChange={(e) => handleInputChange(e, setEditFormData)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => setShowEditModal(false)}
              >
                Batal
              </Button>
              <Button color="primary" variant="flat" onPress={handleEditOutlet}>
                Simpan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedOutlet && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <ModalContent>
            <ModalHeader>Hapus Outlet</ModalHeader>
            <ModalBody>
              <p>
                Apakah Anda yakin ingin menghapus outlet{" "}
                <strong>{selectedOutlet.nama}</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </p>
              <p className="text-red-600 italic mt-2">
                <strong>Catatan:</strong> Outlet yang telah digunakan dalam
                transaksi atau memiliki data terkait mungkin tidak dapat dihapus
                untuk menjaga integritas data.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="flat"
                onPress={() => setShowDeleteModal(false)}
              >
                Batal
              </Button>
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  handleDeleteOutlet(selectedOutlet.id);
                  setShowDeleteModal(false);
                }}
              >
                Hapus
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Outlet;
