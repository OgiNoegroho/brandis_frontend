"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Role } from "@/types/auth";

interface User {
  id: string;
  nama: string;
  email: string;
  peran: Role;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    nama: "",
    email: "",
    peran: "Manajer",
  });

  const token = useAppSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3008/api/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
  }, [token]);

  const handleOpenUpdateUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUpdateUserModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (selectedUser) {
      const response = await fetch(
        `http://localhost:3008/api/users/${selectedUser.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedUser),
        }
      );

      if (response.ok) {
        const updatedUsers = await response.json();
        setUsers(updatedUsers);
        setIsUpdateUserModalOpen(false);
      } else {
        console.error("Failed to update user");
      }
    }
  };

  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const handleAddUser = async () => {
    if (newUser.id && newUser.nama && newUser.email && newUser.peran) {
      const response = await fetch("http://localhost:3008/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, addedUser]);
        setNewUser({ id: "", nama: "", email: "", peran: "Pimpinan" });
        setIsAddUserModalOpen(false);
      } else {
        console.error("Failed to add user");
      }
    } else {
      alert("All fields are required!");
    }
  };

  const handleOpenDeleteUserModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      const response = await fetch(
        `http://localhost:3008/api/users/${selectedUser.email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.email !== selectedUser.email));
        setIsDeleteUserModalOpen(false);
      } else {
        console.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Daftar Pengguna</h1>
        <Button variant="flat" color="success" onPress={handleOpenAddUserModal}>
          Tambah Pengguna
        </Button>
      </div>

      <Table aria-label="User List">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Nama</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Peran</TableColumn>
          <TableColumn>Aksi</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nama}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.peran}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="flat"
                  color="warning"
                  onPress={() => handleOpenUpdateUserModal(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="flat"
                  color="danger"
                  onPress={() => handleOpenDeleteUserModal(user)}
                >
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Tambah Pengguna</ModalHeader>
          <ModalBody>
            <Input
              label="ID Pengguna"
              placeholder="Masukkan ID Pengguna"
              value={newUser.id}
              onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
            />
            <Input
              label="Nama"
              placeholder="Masukkan Nama"
              value={newUser.nama}
              onChange={(e) => setNewUser({ ...newUser, nama: e.target.value })}
            />
            <Input
              label="Email"
              placeholder="Masukkan Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Select
              label="Peran"
              value={newUser.peran}
              onChange={(value) =>
                setNewUser({ ...newUser, peran: value as unknown as Role })
              }
            >
              <SelectItem value="Manajer">Manajer</SelectItem>
              <SelectItem value="Pemasaran">Pemasaran</SelectItem>
              <SelectItem value="Bendahara">Bendahara</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setIsAddUserModalOpen(false)}>
              Batal
            </Button>
            <Button color="success" onPress={handleAddUser}>
              Konfirmasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update User Modal */}
      <Modal
        isOpen={isUpdateUserModalOpen}
        onClose={() => setIsUpdateUserModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Perbarui Pengguna</ModalHeader>
          <ModalBody>
            <Input
              label="Nama"
              placeholder="Masukkan Nama"
              value={selectedUser?.nama || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser!, nama: e.target.value })
              }
            />
            <Input
              label="Email"
              placeholder="Masukkan Email"
              value={selectedUser?.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser!, email: e.target.value })
              }
            />
            <Select
              label="Peran"
              value={selectedUser?.peran || "Pimpinan"}
              onChange={(value) =>
                setSelectedUser({ ...newUser, peran: value as unknown as Role })
              }
            >
              <SelectItem value="Manajer">Manajer</SelectItem>
              <SelectItem value="Pemasaran">Pemasaran</SelectItem>
              <SelectItem value="Bendahara">Bendahara</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => setIsUpdateUserModalOpen(false)}
            >
              Batal
            </Button>
            <Button color="success" onPress={handleUpdateUser}>
              Perbarui
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setIsDeleteUserModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Hapus Pengguna</ModalHeader>
          <ModalBody>
            <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onPress={() => setIsDeleteUserModalOpen(false)}
            >
              Batal
            </Button>
            <Button color="success" onPress={handleDeleteUser}>
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;
