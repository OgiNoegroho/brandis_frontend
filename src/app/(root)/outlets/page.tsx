"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks"; // Importing the useAppSelector hook
import { RootState } from "@/redux/store"; // Importing RootState to access global state
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
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Access the token from Redux state
  const token = useAppSelector((state: RootState) => state.auth.token);

  // Fetch outlets with proper error handling
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
      console.error("Error fetching outlets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, [token]); // Re-fetch outlets if token changes

  // Form validation
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
        alert(errors.join("\n"));
        return;
      }

      if (!token) throw new Error("Authentication token not found");

      // In the handleAddOutlet
      const response = await fetch("http://localhost:3008/api/outlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: formData.outletName, // map outletName to nama
          alamat: formData.address, // map address to alamat
          nomor_telepon: formData.phone, // map phone to nomor_telepon
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newOutlet = await response.json();
      setOutlets((prevOutlets) => [...prevOutlets, newOutlet]);
      setShowCreateModal(false);
      setFormData({ outletName: "", address: "", phone: "" });
      alert("Outlet successfully added!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add outlet");
      console.error("Error adding outlet:", error);
    }
  };

  const handleEditOutlet = async () => {
    if (!selectedOutlet) return;

    try {
      const errors = validateForm(editFormData);
      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      if (!token) throw new Error("Authentication token not found");

      // In the handleEditOutlet
      const response = await fetch(
        `http://localhost:3008/api/outlet/${selectedOutlet.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nama: editFormData.outletName, // map outletName to nama
            alamat: editFormData.address, // map address to alamat
            nomor_telepon: editFormData.phone, // map phone to nomor_telepon
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
      alert("Outlet successfully updated!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update outlet");
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
      alert("Outlet successfully deleted!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete outlet");
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
      <h1 className="text-2xl font-bold mb-2">Outlet</h1>
      <div className="flex justify-end mb-6">
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
                  onPress={() => handleDeleteOutlet(outlet.id)}
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
            <Button color="danger" onPress={() => setShowCreateModal(false)}>
              Batal
            </Button>
            <Button color="primary" onPress={handleAddOutlet}>
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
              <Button color="danger" onPress={() => setShowEditModal(false)}>
                Batal
              </Button>
              <Button color="primary" onPress={handleEditOutlet}>
                Simpan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Outlet;