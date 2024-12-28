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
import { Eye, EyeOff } from "lucide-react";
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

interface UpdateFormData extends Partial<User> {
  password?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateUserModalOpen, setIsUpdateUserModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({});
const [newUser, setNewUser] = useState<NewUser>({
  id: "",
  nama: "",
  email: "",
  peran: "Manajer",
  password: "",
});
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordVisibility, setPasswordVisibility] = useState(false);
const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
  useState(false);

  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const isDarkMode = useAppSelector(
    (state: RootState) => state.global.isDarkMode
  );

  // Add the missing handleUpdateFormChange function
  const handleUpdateFormChange = (
    field: keyof UpdateFormData,
    value: string
  ) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for the field being changed
    setValidationErrors((prev) =>
      prev.filter((error) => error.field !== field)
    );
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      dispatch(
        showErrorToast({
          message: "Failed to fetch users",
          isDarkMode,
        })
      );
    }
  };

 const validateNewUser = (): ValidationError[] => {
   const errors: ValidationError[] = [];

   if (!/^\d{10}$/.test(newUser.id)) {
     errors.push({
       field: "id",
       message: "ID must be a 10-digit number.",
     });
   }

   if (newUser.nama.length < 3 || newUser.nama.length > 100) {
     errors.push({
       field: "nama",
       message: "Name must be between 3 and 100 characters.",
     });
   }

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(newUser.email)) {
     errors.push({
       field: "email",
       message: "Please enter a valid email address.",
     });
   }

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   if (!passwordRegex.test(newUser.password)) {
     errors.push({
       field: "password",
       message:
         "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
     });
   }

   if (newUser.password !== confirmPassword) {
     errors.push({
       field: "confirmPassword",
       message: "Passwords do not match.",
     });
   }

   return errors;
 };


  const validateUpdateUser = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (
      updateFormData.nama &&
      (updateFormData.nama.length < 3 || updateFormData.nama.length > 100)
    ) {
      errors.push({
        field: "nama",
        message: "Name must be between 3 and 100 characters.",
      });
    }

    if (updateFormData.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(updateFormData.password)) {
        errors.push({
          field: "password",
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        });
      }
    }

    return errors;
  };

  const getErrorMessage = (field: string): string => {
    return (
      validationErrors.find((error) => error.field === field)?.message || ""
    );
  };

  const handleOpenUpdateUserModal = (user: User) => {
    setSelectedUser(user);
    setUpdateFormData({
      nama: user.nama,
      peran: user.peran,
      password: "", // Initialize with empty password
    });
    setValidationErrors([]);
    setIsUpdateUserModalOpen(true);
  };

 const handleUpdateUser = async () => {
   if (!selectedUser || !updateFormData) return;

   const errors = validateUpdateUser();
   if (errors.length > 0) {
     setValidationErrors(errors);
     return;
   }

   try {
     setIsLoading(true);

     // Only include fields that have actually changed and aren't empty
     const changes: UpdateFormData = {};
     Object.keys(updateFormData).forEach((key) => {
       const k = key as keyof UpdateFormData;
       if (k === "password") {
         // Only include password if it's not empty
         if (updateFormData[k] && updateFormData[k]?.trim() !== "") {
           changes[k] = updateFormData[k];
         }
       } else if (k === "peran") {
         const peranValue = updateFormData[k];
         if (
           peranValue &&
           ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"].includes(
             peranValue
           ) &&
           peranValue !== selectedUser[k]
         ) {
           changes[k] = peranValue as Role;
         }
       } else {
         // Handle other fields
         if (updateFormData[k] !== selectedUser[k as keyof User]) {
           changes[k] = updateFormData[k];
         }
       }
     });

     // If no changes, just close the modal
     if (Object.keys(changes).length === 0) {
       setIsUpdateUserModalOpen(false);
       return;
     }

     const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser.email}`,
       {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(changes),
       }
     );

     const data = await response.json();

     if (!response.ok) {
       if (data.errors) {
         setValidationErrors(data.errors);
         throw new Error("Validation failed");
       }
       throw new Error(data.message || "Failed to update user");
     }

     setUsers((prevUsers) =>
       prevUsers.map((user) =>
         user.email === selectedUser.email ? { ...user, ...changes } : user
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

  const handleAddUser = async () => {
    setValidationErrors([]);

    const errors = validateNewUser();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setValidationErrors(data.errors);
          throw new Error("Validation failed");
        }
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
    if (!selectedUser) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser.email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.email !== selectedUser.email)
      );

      dispatch(
        showSuccessToast({
          message: "Pengguna berhasil dihapus",
          isDarkMode,
        })
      );

      setIsDeleteUserModalOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      dispatch(
        showErrorToast({
          message:
            error instanceof Error ? error.message : "Gagal menghapus pengguna",
          isDarkMode,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
    setValidationErrors([]);
  };

  return (
    <div className="container pl-12 sm:px-6 lg:pl-0 content">
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

      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => {
          setIsAddUserModalOpen(false);
          setValidationErrors([]);
          setNewUser({
            id: "",
            nama: "",
            email: "",
            peran: "Manajer",
            password: "",
          });
          setConfirmPassword("");
        }}
        size="2xl"
      >
        <ModalContent style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <ModalHeader>Tambah Pengguna Baru</ModalHeader>
          <ModalBody>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              {/* Hidden fields for preventing autofill */}
              <input
                type="text"
                name="username"
                style={{ display: "none" }}
                aria-hidden="true"
              />
              <input
                type="password"
                name="password"
                style={{ display: "none" }}
                aria-hidden="true"
              />

              <Input
                label="ID"
                value={newUser.id}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setNewUser((prev) => ({ ...prev, id: value }));
                }}
                errorMessage={getErrorMessage("id")}
                isInvalid={!!getErrorMessage("id")}
                className="mb-4"
                autoComplete="off"
                name="new-user-id"
                placeholder="Contoh: 1234567890"
                description="Masukkan 10 digit angka"
                labelPlacement="outside"
              />

              <Input
                label="Nama"
                value={newUser.nama}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 100);
                  setNewUser((prev) => ({ ...prev, nama: value }));
                }}
                errorMessage={getErrorMessage("nama")}
                isInvalid={!!getErrorMessage("nama")}
                className="mb-4"
                autoComplete="off"
                name="new-user-name"
                placeholder="Contoh: John Doe"
                description="Minimal 3 karakter, maksimal 100 karakter"
                labelPlacement="outside"
              />
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  setNewUser((prev) => ({ ...prev, email: value }));
                }}
                errorMessage={getErrorMessage("email")}
                isInvalid={!!getErrorMessage("email")}
                className="mb-4"
                autoComplete="new-email"
                name="new-user-email"
                placeholder="contoh@email.com"
                description="Masukkan alamat email yang valid"
                labelPlacement="outside"
              />
              <Input
                label="Password"
                type={passwordVisibility ? "text" : "password"}
                value={newUser.password}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 50);
                  setNewUser((prev) => ({ ...prev, password: value }));
                }}
                errorMessage={getErrorMessage("password")}
                isInvalid={!!getErrorMessage("password")}
                className="mb-4"
                autoComplete="new-password"
                name="new-user-password"
                description={
                  <div className="text-sm text-default-500">
                    Password harus memenuhi kriteria berikut:
                    <ul className="list-disc ml-4 mt-1">
                      <li>Minimal 8 karakter</li>
                      <li>Minimal 1 huruf besar</li>
                      <li>Minimal 1 huruf kecil</li>
                      <li>Minimal 1 angka</li>
                    </ul>
                  </div>
                }
                labelPlacement="outside"
                endContent={
                  passwordVisibility ? (
                    <EyeOff
                      size={20}
                      onClick={() => setPasswordVisibility((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <Eye
                      size={20}
                      onClick={() => setPasswordVisibility((prev) => !prev)}
                      style={{ cursor: "pointer" }}
                    />
                  )
                }
              />
              <Input
                label="Confirm Password"
                type={confirmPasswordVisibility ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value.slice(0, 50))
                }
                errorMessage={getErrorMessage("confirmPassword")}
                isInvalid={!!getErrorMessage("confirmPassword")}
                className="mb-4"
                autoComplete="new-password"
                name="confirm-user-password"
                description="Masukkan kembali password untuk mengkonfirmasi."
                labelPlacement="outside"
                endContent={
                  confirmPasswordVisibility ? (
                    <EyeOff
                      size={20}
                      onClick={() =>
                        setConfirmPasswordVisibility((prev) => !prev)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <Eye
                      size={20}
                      onClick={() =>
                        setConfirmPasswordVisibility((prev) => !prev)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  )
                }
              />
              <Select
                label="Peran"
                selectedKeys={[newUser.peran]}
                onChange={(e) => {
                  const value = e.target.value as Role;
                  if (
                    ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"].includes(
                      value
                    )
                  ) {
                    setNewUser((prev) => ({
                      ...prev,
                      peran: value,
                    }));
                  }
                }}
                errorMessage={getErrorMessage("peran")}
                isInvalid={!!getErrorMessage("peran")}
                autoComplete="off"
                description="Pilih peran pengguna"
                labelPlacement="outside"
              >
                <SelectItem key="Manajer" value="Manajer">
                  Manajer
                </SelectItem>
                <SelectItem key="Bendahara" value="Bendahara">
                  Bendahara
                </SelectItem>
                <SelectItem key="Pemasaran" value="Pemasaran">
                  Pemasaran
                </SelectItem>
                <SelectItem key="Pimpinan" value="Pimpinan">
                  Pimpinan
                </SelectItem>
              </Select>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => {
                setIsAddUserModalOpen(false);
                setValidationErrors([]);
                setNewUser({
                  id: "",
                  nama: "",
                  email: "",
                  peran: "Manajer",
                  password: "",
                });
                setConfirmPassword("");
              }}
            >
              Batal
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={handleAddUser}
              isLoading={isLoading}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isUpdateUserModalOpen}
        onClose={() => {
          setIsUpdateUserModalOpen(false);
          setValidationErrors([]);
        }}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Update Pengguna</ModalHeader>
          <ModalBody>
            <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              {/* Hidden fields for preventing autofill */}
              <input
                type="text"
                name="username"
                style={{ display: "none" }}
                aria-hidden="true"
              />
              <input
                type="password"
                name="password"
                style={{ display: "none" }}
                aria-hidden="true"
              />

              <Input
                label="Nama"
                value={updateFormData.nama || ""}
                onChange={(e) => {
                  // Limit to 100 characters
                  const value = e.target.value.slice(0, 100);
                  handleUpdateFormChange("nama", value);
                }}
                errorMessage={getErrorMessage("nama")}
                isInvalid={!!getErrorMessage("nama")}
                className="mb-4"
                autoComplete="off"
                name="update-user-name"
                placeholder="Contoh: John Doe"
                description="Minimal 3 karakter, maksimal 100 karakter"
                labelPlacement="outside"
              />
              <Input
                label="Password"
                type="password"
                value={updateFormData.password || ""}
                onChange={(e) => {
                  // Limit password length
                  const value = e.target.value.slice(0, 50);
                  handleUpdateFormChange("password", value);
                }}
                errorMessage={getErrorMessage("password")}
                isInvalid={!!getErrorMessage("password")}
                className="mb-4"
                autoComplete="new-password"
                name="update-user-password"
                placeholder="Kosongkan jika tidak ingin mengganti password"
                description={
                  <div className="text-sm text-default-500">
                    Password harus memenuhi kriteria berikut:
                    <ul className="list-disc ml-4 mt-1">
                      <li>Minimal 8 karakter</li>
                      <li>Minimal 1 huruf besar</li>
                      <li>Minimal 1 huruf kecil</li>
                      <li>Minimal 1 angka</li>
                    </ul>
                  </div>
                }
                labelPlacement="outside"
              />
              <Select
                label="Peran"
                selectedKeys={
                  updateFormData.peran ? [updateFormData.peran] : []
                }
                onChange={(e) => {
                  const value = e.target.value as Role;
                  if (
                    ["Pimpinan", "Manajer", "Pemasaran", "Bendahara"].includes(
                      value
                    )
                  ) {
                    handleUpdateFormChange("peran", value);
                  }
                }}
                errorMessage={getErrorMessage("peran")}
                isInvalid={!!getErrorMessage("peran")}
                autoComplete="off"
                description="Pilih peran pengguna"
                labelPlacement="outside"
              >
                <SelectItem key="Manajer" value="Manajer">
                  Manajer
                </SelectItem>
                <SelectItem key="Bendahara" value="Bendahara">
                  Bendahara
                </SelectItem>
                <SelectItem key="Pemasaran" value="Pemasaran">
                  Pemasaran
                </SelectItem>
                <SelectItem key="Pimpinan" value="Pimpinan">
                  Pimpinan
                </SelectItem>
              </Select>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => {
                setIsUpdateUserModalOpen(false);
                setValidationErrors([]);
              }}
            >
              Batal
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={handleUpdateUser}
              isLoading={isLoading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDeleteUserModalOpen}
        onClose={() => setIsDeleteUserModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Hapus Pengguna</ModalHeader>
          <ModalBody>
            <p>
              Apakah Anda yakin ingin menghapus pengguna{" "}
              <strong>{selectedUser?.nama}</strong>?
            </p>
            <p style={{ color: "red", marginTop: "1rem" }}>
              <strong>Catatan:</strong> Penghapusan ini bersifat permanen dan
              tidak dapat dibatalkan.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => setIsDeleteUserModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={handleDeleteUser}
              isLoading={isLoading}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;