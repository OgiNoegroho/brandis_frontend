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

      const response = await fetch("https://brandis-backend.vercel.app/api/outlet", {
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
const response = await fetch("https://brandis-backend.vercel.app/api/outlet", {
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
  `https://brandis-backend.vercel.app/api/outlet/${selectedOutlet.id}`,
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

      const response = await fetch(`https://brandis-backend.vercel.app/api/outlet/${id}`, {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Outlets</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600 transition"
        onClick={() => setShowCreateModal(true)}
      >
        Add Outlet
      </button>
      
      {outlets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No outlets found. Add your first outlet to get started.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {outlets.map((outlet) => (
            <div
              key={outlet.id}
              className="flex justify-between items-center border-b p-4 hover:bg-gray-100 transition"
            >
              <div>
                <h2 className="text-lg font-semibold">{outlet.nama}</h2>
                <p className="text-sm text-gray-600">{outlet.alamat}</p>
                <p className="text-sm text-gray-600">{outlet.nomor_telepon}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleOpenEditModal(outlet)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteOutlet(outlet.id)}
                >
                  Delete
                </button>
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handleViewDetails(outlet.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Outlet</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Outlet Name
              </label>
              <input
                type="text"
                name="outletName"
                value={formData.outletName}
                onChange={(e) => handleInputChange(e, setFormData)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange(e, setFormData)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange(e, setFormData)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleAddOutlet}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOutlet && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Outlet</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Outlet Name
              </label>
              <input
                type="text"
                name="outletName"
                value={editFormData.outletName}
                onChange={(e) => handleInputChange(e, setEditFormData)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={editFormData.address}
                onChange={(e) => handleInputChange(e, setEditFormData)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={(e) => handleInputChange(e, setEditFormData)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleEditOutlet}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Outlet;
