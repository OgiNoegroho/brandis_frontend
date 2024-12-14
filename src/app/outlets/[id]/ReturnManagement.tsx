import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

// Definisikan tipe untuk data return
interface ReturnData {
  returnId: string;
  productName: string;
  batchName: string;
  quantity: number;
  reason: string;
  returnDate: string;
}

const ReturnManagement = () => {
  // State untuk menyimpan data return yang belum disimpan
  const [returnData, setReturnData] = useState<ReturnData[]>([
    {
      returnId: "1",
      productName: "Product A",
      batchName: "Batch 1",
      quantity: 5,
      reason: "Damaged",
      returnDate: "2024-11-02",
    },
    {
      returnId: "2",
      productName: "Product B",
      batchName: "Batch 2",
      quantity: 2,
      reason: "Expired",
      returnDate: "2024-11-04",
    },
  ]);

  // State untuk menyimpan history return yang sudah disimpan
  const [returnHistory, setReturnHistory] = useState<ReturnData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [newReturn, setNewReturn] = useState<ReturnData>({
    returnId: "",
    productName: "",
    batchName: "",
    quantity: 0,
    reason: "",
    returnDate: "",
  });

  // Fungsi untuk menambah return baru
  const handleAddReturn = () => {
    // Pastikan semua field sudah terisi
    if (
      !newReturn.productName ||
      !newReturn.batchName ||
      !newReturn.quantity ||
      !newReturn.reason ||
      !newReturn.returnDate
    ) {
      alert("Please fill all the fields");
      return;
    }

    // Pastikan quantity adalah angka positif
    const quantity = parseInt(newReturn.quantity.toString(), 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Quantity must be a positive number");
      return;
    }

    // Buat entry baru untuk return
    const newEntry = {
      ...newReturn,
      quantity, // pastikan quantity adalah angka
      returnId: Date.now().toString(), // ID unik
    };

    // Update state returnData dengan entry baru
    setReturnData((prevData) => [...prevData, newEntry]);

    // Reset form setelah menambah data
    setNewReturn({
      returnId: "",
      productName: "",
      batchName: "",
      quantity: 0,
      reason: "",
      returnDate: "",
    });

    // Tutup modal setelah data ditambahkan
    setIsModalOpen(false);
  };

  // Fungsi untuk menyimpan return ke history dan menghapusnya dari returnData
  const handleSaveReturns = () => {
    // Pastikan ada data untuk disimpan
    if (returnData.length === 0) {
      alert("No returns to save.");
      return;
    }

    // Tambahkan data returnData ke returnHistory
    setReturnHistory((prevHistory) => {
      return [...prevHistory, ...returnData]; // Gabungkan history dengan data baru
    });

    // Hapus data yang ada di returnData setelah disimpan ke history
    setReturnData([]);
  };

  // Efek untuk memantau perubahan pada returnHistory
  useEffect(() => {
    console.log("Updated returnHistory:", returnHistory);
  }, [returnHistory]);

  // Efek untuk memantau perubahan pada returnData
  useEffect(() => {
    console.log("Updated returnData:", returnData);
  }, [returnData]);

  return (
    <div className="space-y-6">
      {/* Return Management Section */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Return Management</h3>

        {/* Button untuk membuka modal */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add New Return
          </button>
        </div>

        {/* Tabel untuk menampilkan return yang belum disimpan */}
        <Table aria-label="Return history for each product">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Batch</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Reason</TableColumn>
            <TableColumn>Return Date</TableColumn>
          </TableHeader>
          <TableBody>
            {returnData.map((item) => (
              <TableRow key={item.returnId}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.batchName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.returnDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Tombol untuk menyimpan return */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveReturns}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Save Returns
          </button>
        </div>
      </div>

      {/* Management History Table */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Management History</h3>
        <Table aria-label="Management history for saved returns">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Batch</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Reason</TableColumn>
            <TableColumn>Return Date</TableColumn>
          </TableHeader>
          <TableBody>
            {returnHistory.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.batchName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.returnDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal untuk menambah return baru */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold">Add New Return</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
              <div>
              <label className="block text-sm font-medium">Product Name</label>
              <select
                value={newReturn.productName}
                onChange={(e) =>
                  setNewReturn({ ...newReturn, productName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select a product</option>
                {/* Populate dropdown with product names */}
                {returnHistory.map((item) => (
                  <option key={item.returnId} value={item.productName}>
                    {item.productName}
                  </option>
                ))}
              </select>
            </div>

              </div>
              <div>
                <label className="block text-sm font-medium">Batch Name</label>
                <input
                  type="text"
                  value={newReturn.batchName}
                  onChange={(e) =>
                    setNewReturn({ ...newReturn, batchName: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  value={newReturn.quantity}
                  onChange={(e) => {
                    const quantity = parseInt(e.target.value, 10);
                    setNewReturn({
                      ...newReturn,
                      quantity: isNaN(quantity) ? 0 : quantity,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Reason</label>
                <input
                  type="text"
                  value={newReturn.reason}
                  onChange={(e) =>
                    setNewReturn({ ...newReturn, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Return Date</label>
                <input
                  type="date"
                  value={newReturn.returnDate}
                  onChange={(e) =>
                    setNewReturn({ ...newReturn, returnDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReturn}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnManagement;
