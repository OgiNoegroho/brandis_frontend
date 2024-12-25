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
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";
import { Role } from "@/types/auth";

interface User {
  id: string;
  nama: string;
  email: string;
  peran: Role;
}

interface NewUser extends User {
  password: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState<Partial<User>>({});
  const [newUser, setNewUser] = useState<NewUser>({
    id: "",
    nama: "",
    email: "",
    peran: "Manajer",
    password: "",
  });

  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

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
   setUpdateFormData(user);
   setIsUpdateUserModalOpen(true);
 };

 const handleUpdateUser = async () => {
   if (!selectedUser || !updateFormData) return;

   try {
     setIsLoading(true);

     // Only include fields that have actually changed
     const changes: Partial<User> = {};
     Object.keys(updateFormData).forEach((key) => {
       const k = key as keyof User;
       if (updateFormData[k] !== selectedUser[k]) {
         changes[k] = updateFormData[k] as Role;
       }
     });

     // If no changes, just close the modal
     if (Object.keys(changes).length === 0) {
       setIsUpdateUserModalOpen(false);
       return;
     }

     const response = await fetch(
       `http://localhost:3008/api/users/${selectedUser.email}`,
       {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(changes),
       }
     );

     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.message || "Failed to update user");
     }

     const updatedUser = await response.json();

     // Update the users list with the new data
     setUsers((prevUsers) =>
       prevUsers.map((user) =>
         user.email === selectedUser.email ? updatedUser : user
       )
     );

     dispatch(
       showSuccessToast({
         message: "Pengguna berhasil diperbarui",
         isDarkMode,
       })
     );

     setIsUpdateUserModalOpen(false);
   } catch (error) {
     console.error("Error updating user:", error);
     dispatch(
       showErrorToast({
         message:
           error instanceof Error
             ? error.message
             : "Gagal memperbarui pengguna",
         isDarkMode,
       })
     );
   } finally {
     setIsLoading(false);
   }
 };


  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

   const handleAddUser = async () => {
     try {
       setIsLoading(true);

       const response = await fetch(
         "http://localhost:3008/api/users/register",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({
             id: newUser.id,
             nama: newUser.nama,
             email: newUser.email,
             password: newUser.password,
             peran: newUser.peran,
           }),
         }
       );

       const data = await response.json();

       if (!response.ok) {
         throw new Error(data.message || "Failed to add user");
       }

       setUsers((prevUsers) => [
         ...prevUsers,
         {
           id: data.id,
           nama: data.nama,
           email: data.email,
           peran: data.peran,
         },
       ]);

       setNewUser({
         id: "",
         nama: "",
         email: "",
         peran: "Manajer",
         password: "",
       });

       setIsAddUserModalOpen(false);
       dispatch(
         showSuccessToast({
           message: "Pengguna berhasil ditambahkan",
           isDarkMode,
         })
       );
     } catch (error) {
       console.error("Error adding user:", error);
       dispatch(
         showErrorToast({
           message:
             error instanceof Error
               ? error.message
               : "Gagal menambahkan pengguna",
           isDarkMode,
         })
       );
     } finally {
       setIsLoading(false);
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
          <ModalHeader>Tambah Pengguna Baru</ModalHeader>
          <ModalBody>
            <Input
              label="ID"
              value={newUser.id}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, id: e.target.value }))
              }
            />
            <Input
              label="Nama"
              value={newUser.nama}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, nama: e.target.value }))
              }
            />
            <Input
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <Input
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <Select
              label="Peran"
              selectedKeys={[newUser.peran]}
              onChange={(e) => {
                setNewUser((prev) => ({
                  ...prev,
                  peran: e.target.value as Role,
                }));
              }}
            >
              <SelectItem key="Manajer">Manajer</SelectItem>
              <SelectItem key="Bendahara">Bendahara</SelectItem>
              <SelectItem key="Pemasaran">Pemasaran</SelectItem>
              <SelectItem key="Pimpinan">Pimpinan</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={() => setIsAddUserModalOpen(false)}>
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleAddUser}
              isLoading={isLoading}
            >
              Simpan
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
          <ModalHeader>Update Pengguna</ModalHeader>
          <ModalBody>
            <Input
              label="Nama"
              value={updateFormData.nama || ""}
              onChange={(e) =>
                setUpdateFormData((prev) => ({ ...prev, nama: e.target.value }))
              }
              className="mb-4"
            />
            <Select
              label="Peran"
              value={updateFormData.peran || ""}
              onChange={(e) =>
                setUpdateFormData((prev) => ({
                  ...prev,
                  peran: e.target.value as Role,
                }))
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
              variant="light"
              onPress={() => setIsUpdateUserModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateUser}
              isLoading={isLoading}
            >
              Update
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
            Apakah Anda yakin ingin menghapus pengguna{" "}
            <strong>{selectedUser?.nama}</strong>?
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
