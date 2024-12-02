"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Outlet {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
}

const Outlet = () => {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false); // Untuk modal create
  const [showEditModal, setShowEditModal] = useState(false); // Untuk modal edit
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null); // Data outlet yang akan di-edit

  const [formData, setFormData] = useState({
    outletName: "",
    outletID: "",
    userID: "",
    address: "",
    phone: "",
  });

  const [editFormData, setEditFormData] = useState({
    outletName: "",
    outletID: "",
    userID: "",
    address: "",
    phone: "",
  });

  const outlets: Outlet[] = [
    { id: "1", name: "Outlet A", address: "123 Main St", phoneNumber: "123-456-7890" },
    { id: "2", name: "Outlet B", address: "456 Elm St", phoneNumber: "987-654-3210" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOutlet = () => {
    console.log("New outlet added:", formData);
    alert("Outlet successfully added!");
    setShowCreateModal(false); // Close the modal
  };

  const handleEditOutlet = () => {
    console.log("Edited outlet:", editFormData);
    alert("Outlet successfully updated!");
    setShowEditModal(false); // Close the modal
  };

  const handleOpenEditModal = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setEditFormData({
      outletName: outlet.name,
      outletID: outlet.id,
      userID: "Default User ID", // Atur sesuai kebutuhan
      address: outlet.address,
      phone: outlet.phoneNumber,
    });
    setShowEditModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Outlets</h1>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
        onClick={() => setShowCreateModal(true)} // Open the create modal
      >
        Add Outlet
      </button>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="flex justify-between items-center border-b p-4 hover:bg-gray-100 transition"
          >
            <div>
              <h2 className="text-lg font-semibold">{outlet.name}</h2>
              <p className="text-sm text-gray-600">{outlet.address}</p>
              <p className="text-sm text-gray-600">{outlet.phoneNumber}</p>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                onClick={() => handleOpenEditModal(outlet)} // Open the edit modal
              >
                Edit
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                onClick={() => router.push(`/outletDetails/${outlet.id}`)}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create New Outlet */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Outlet</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Outlet Name</label>
              <input
                type="text"
                name="outletName"
                value={formData.outletName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter outlet name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Outlet ID</label>
              <input
                type="text"
                name="outletID"
                value={formData.outletID}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter outlet ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">User ID</label>
              <input
                type="text"
                name="userID"
                value={formData.userID}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter user ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)} // Close the modal
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Discard
              </button>
              <button
                onClick={handleAddOutlet}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Add Outlet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Edit Outlet */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Outlet</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Outlet Name</label>
              <input
                type="text"
                name="outletName"
                value={editFormData.outletName}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter outlet name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Outlet ID</label>
              <input
                type="text"
                name="outletID"
                value={editFormData.outletID}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter outlet ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">User ID</label>
              <input
                type="text"
                name="userID"
                value={editFormData.userID}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter user ID"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={editFormData.address}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter address"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter phone number"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)} // Close the modal
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Discard
              </button>
              <button
                onClick={handleEditOutlet}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Outlet;