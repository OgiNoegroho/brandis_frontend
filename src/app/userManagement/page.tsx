"use client"

import { useState, useEffect } from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface User {
  id: string;
  nama: string;
  email: string;
  peran: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    nama: "",
    email: "",
    peran: "",
  });

  // Retrieve the token from Redux state
  const token = useAppSelector((state: RootState) => state.auth.token);

  // Fetch users from the backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://brandis-backend.vercel.app/api/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Bearer token to the header
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data); 
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]); // Make sure to re-fetch if token changes

  // Handle opening update modal
  const handleOpenUpdateUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUpdateUserModalOpen(true);
  };

  // Handle updating user
  const handleUpdateUser = async () => {
    if (selectedUser) {
      const response = await fetch(`https://brandis-backend.vercel.app/api/users/${selectedUser.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Bearer token to the header
        },
        body: JSON.stringify(selectedUser),
      });

      if (response.ok) {
        const updatedUsers = await response.json();
        setUsers(updatedUsers);
        setIsUpdateUserModalOpen(false);
      } else {
        console.error("Failed to update user");
      }
    }
  };

  // Handle opening add user modal
  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  // Handle adding new user
  const handleAddUser = async () => {
    if (newUser.id && newUser.nama && newUser.email && newUser.peran) {
      const response = await fetch("https://brandis-backend.vercel.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Bearer token to the header
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, addedUser]);
        setNewUser({ id: "", nama: "", email: "", peran: "" });
        setIsAddUserModalOpen(false);
      } else {
        console.error("Failed to add user");
      }
    } else {
      alert("All fields are required!");
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (email: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const response = await fetch(`https://brandis-backend.vercel.app/api/users/${email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Bearer token to the header
        },
      });

      if (response.ok) {
        const updatedUsers = users.filter((user) => user.email !== email);
        setUsers(updatedUsers); 
      } else {
        console.error("Failed to delete user");
      }
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
      <Table aria-label="User List">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nama</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Peran</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nama}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.peran}</TableCell>
              <TableCell>
                <Button onClick={() => handleOpenUpdateUserModal(user)}>Update</Button>
                <Button onClick={() => handleDeleteUser(user.email)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
                value={newUser.nama}
                onChange={(e) =>
                  setNewUser({ ...newUser, nama: e.target.value })
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
                value={newUser.peran}
                onChange={(e) =>
                  setNewUser({ ...newUser, peran: e.target.value })
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
              <label className="block mb-1 font-medium">Nama</label>
              <input
                type="text"
                placeholder="Masukkan Nama"
                className="w-full border px-4 py-2 rounded"
                value={selectedUser.nama}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, nama: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="Masukkan Email"
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
                placeholder="Masukkan Peran"
                className="w-full border px-4 py-2 rounded"
                value={selectedUser.peran}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, peran: e.target.value })
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
