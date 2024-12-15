"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks"; // Importing the useAppSelector hook
import { RootState } from "@/redux/store"; // Importing RootState to access global state

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
    alamat: formData.address,   // map address to alamat
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
      alamat: editFormData.address,   // map address to alamat
      nomor_telepon: editFormData.phone, // map phone to nomor_telepon
    })
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

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
        <button
          onClick={fetchOutlets}
          className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pl-12">
      
        <h1 className="text-2xl font-bold mb-2">Outlet</h1>
        <div className="flex justify-end mb-6">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => setShowCreateModal(true)}
        >
          Tambah Outlet
        </button>
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
                <button
                  onClick={() => handleViewDetails(outlet.id)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                >
                  Detail
                </button>
                <button
                  onClick={() => handleOpenEditModal(outlet)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteOutlet(outlet.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Tambah Outlet Baru</h2>
            <input
              type="text"
              name="Nama Outlet"
              placeholder="Nama Outlet"
              value={formData.outletName}
              onChange={(e) => handleInputChange(e, setFormData)}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="Alamat"
              placeholder="Alamat"
              value={formData.address}
              onChange={(e) => handleInputChange(e, setFormData)}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="Nomor Telepon"
              placeholder="Nomor Telepon"
              value={formData.phone}
              onChange={(e) => handleInputChange(e, setFormData)}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleAddOutlet}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOutlet && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Outlet</h2>
            <input
              type="text"
              name="outletName"
              placeholder="Nama Outlet"
              value={editFormData.outletName}
              onChange={(e) => handleInputChange(e, setEditFormData)}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Alamat"
              value={editFormData.address}
              onChange={(e) => handleInputChange(e, setEditFormData)}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Nomor Telepon"
              value={editFormData.phone}
              onChange={(e) => handleInputChange(e, setEditFormData)}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Batal
              </button>
              <button
                onClick={handleEditOutlet}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Simpan 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Outlet;
