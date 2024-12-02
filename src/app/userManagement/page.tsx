"use client";

import React, { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: "123-123-123", name: "Shohilin", email: "shohilin_ganteng@gmail.com", role: "Pimpinan" },
    { id: "234-234-234", name: "Ahmad", email: "ahmad_123@yahoo.com", role: "Admin Produksi" },
    { id: "345-345-345", name: "Andin", email: "andin_andin@gmail.com", role: "Bendahara" },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  // Handle opening update modal
  const handleOpenUpdateUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUpdateUserModalOpen(true);
  };

  // Handle updating user
  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? selectedUser : user
        )
      );
      setIsUpdateUserModalOpen(false);
    }
  };

  // Handle opening add user modal
  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  // Handle adding new user
  const handleAddUser = () => {
    if (newUser.id && newUser.name && newUser.email && newUser.role) {
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setNewUser({ id: "", name: "", email: "", role: "" });
      setIsAddUserModalOpen(false);
    } else {
      alert("Semua field wajib diisi!");
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Daftar User</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-lg"
          onClick={handleOpenAddUserModal}
        >
          Add User
        </button>
      </div>

      {/* User Table */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Peran</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => handleOpenUpdateUserModal(user)}
                >
                  Update
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-lg font-bold mb-4">Tambah User</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">ID User</label>
              <input
                type="text"
                placeholder="Masukkan ID User"
                className="w-full border px-4 py-2 rounded"
                value={newUser.id}
                onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                placeholder="Masukkan Nama"
                className="w-full border px-4 py-2 rounded"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="Masukkan Email"
                className="w-full border px-4 py-2 rounded"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Peran</label>
              <input
                type="text"
                placeholder="Masukkan Peran"
                className="w-full border px-4 py-2 rounded"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddUser}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update User Modal */}
      {isUpdateUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-lg font-bold mb-4">Update User</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">ID User</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded bg-gray-100 cursor-not-allowed"
                value={selectedUser.id}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full border px-4 py-2 rounded"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full border px-4 py-2 rounded"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Peran</label>
              <input
                type="text"
                placeholder="08xx-xxxx-xxxx"
                className="w-full border px-4 py-2 rounded"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setIsUpdateUserModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateUser}
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

export default UserManagement;