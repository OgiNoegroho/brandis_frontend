import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Divider
} from "@nextui-org/react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

type ProductEntry = {
  productName: string;
  batchName: string;
  quantity: string;
  distributionDate: string;
};

type DistributionTableEntry = {
  faktur_id: string;
  distribusi_id: number;
  distribusi_created_at: string;
};

type DistributionDetailEntry = {
  batch_id: number;
  batch_name: string;
  product_name: string;
  quantity: number;
};

type FakturEntry = {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  outlet_name: string;
  outlet_address: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  payment_status: "Lunas" | "Menunggu";
};


type SavedDistribution = {
  details: { batch_id: number; kuantitas_terjual: number }[];
};

type Product = {
  id: number;
  nama: string;
};

type Batch = {
  batch_id: number;
  nama_batch: string;
  nama_produk: string;
  kuantitas_batch: number;
  tanggal_kadaluarsa: string;
  produksi_pada: string;
};

interface DistributionHistoryProps {
  outletId: string;
}

const DistributionHistory: React.FC<DistributionHistoryProps> = ({ outletId }) => {
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([]);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [savedDistributions, setSavedDistributions] = useState<
    SavedDistribution[]
  >([]);
  const [distributions, setDistributions] = useState<DistributionTableEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFakturModalOpen, setIsFakturModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<
    DistributionDetailEntry[] | null
  >(null);
  const [fakturData, setFakturData] = useState<FakturEntry[] | null>(null);

  const [newProduct, setNewProduct] = useState<ProductEntry>({
    productName: "",
    batchName: "",
    quantity: "",
    distributionDate: "",
  });
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"Lunas" | "Menunggu">(
    "Menunggu"
  );
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const formatDate = (date?: string | number | null) => {
    if (!date) return "N/A";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Adds leading zero if day is less than 10
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; // Return in DDMMYYYY format
  };

  // New state for dropdowns
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [loadingBatches, setLoadingBatches] = useState(false);

  const token = useAppSelector((state: RootState) => state.auth.token);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3008/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch batches based on selected product
  const fetchBatches = async (productId: string) => {
    setLoadingBatches(true);
    try {
      const response = await fetch(
        `http://localhost:3008/api/inventory/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch batches");

      const data: Batch[] = await response.json();

      // Update both states
      setBatches(data); // For the dropdown
      setAllBatches((prevBatches) => {
        // Create a new array with unique batches
        const newBatches = [...prevBatches];
        data.forEach((newBatch: Batch) => {
          if (
            !newBatches.some(
              (existingBatch) => existingBatch.batch_id === newBatch.batch_id
            )
          ) {
            newBatches.push(newBatch);
          }
        });
        return newBatches;
      });
    } catch (error) {
      console.error(error);
      setBatches([]);
    } finally {
      setLoadingBatches(false);
    }
  };

  // Fetch all distributions for the outlet
  useEffect(() => {
    if (outletId) {
      fetchDistributions();
    }
  }, [outletId, token]);

  // Fetch distributions method
  const fetchDistributions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const outletIdNumber = Number(outletId);

      if (isNaN(outletIdNumber)) {
        throw new Error("Invalid outlet ID");
      }

      const response = await fetch(
        `http://localhost:3008/api/distribusi/${outletIdNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch distributions");
      }

      const data: DistributionTableEntry[] = await response.json();

      // Validate response structure
      if (!Array.isArray(data)) {
        throw new Error("Invalid response structure: expected an array");
      }

      setDistributions(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching distributions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = async (distributionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3008/api/distribusi/detail/${distributionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch distribution details"
        );
      }

      const data: DistributionDetailEntry[] = await response.json();

      // Validate response
      if (
        !Array.isArray(data) ||
        data.some(
          (entry) => !entry.batch_id || !entry.product_name || !entry.quantity
        )
      ) {
        throw new Error("Invalid response structure");
      }

      setDetailData(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching distribution details:", error);
      // Optionally, set an error state or show a message in the modal
    }
  };

  const handleViewFaktur = async (distributionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3008/api/faktur/${distributionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch invoice details");
      }

      const data: FakturEntry[] = await response.json();

      // Validate response
      if (
        !Array.isArray(data) ||
        data.some(
          (entry) =>
            !entry.invoice_number || !entry.invoice_date || !entry.grand_total
        )
      ) {
        throw new Error("Invalid response structure");
      }

      setFakturData(data);
      setIsFakturModalOpen(true);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      // Optionally, set an error state to reflect issues in the modal
    }
  };

  // Handle product selection
  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    setSelectedBatch(""); // Reset batch when product changes

    // Find the selected product name for display
    const product = products.find((p) => p.id.toString() === productId);
    setNewProduct((prev) => ({
      ...prev,
      productName: product ? product.nama : "",
    }));

    // Fetch batches for the selected product
    fetchBatches(productId);
  };

  // Handle batch selection
  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);

    // Find the selected batch name for display
    const batch = batches.find((b) => b.batch_id.toString() === batchId);
    setNewProduct((prev) => ({
      ...prev,
      batchName: batch ? batch.nama_batch : "",
    }));
  };

  // Function to remove a product entry
  const handleRemoveProduct = (index: number) => {
    setProductEntries((prevEntries) =>
      prevEntries.filter((_, i) => i !== index)
    );
  };

  // Function to handle adding a new product entry
  // In handleAddProduct:
  const handleAddProduct = () => {
    if (!selectedProduct || !selectedBatch || !newProduct.quantity) {
      alert("Please fill in all product details");
      return;
    }

    // Find the selected batch and product data
    const selectedBatchData = batches.find(
      (b) => b.batch_id.toString() === selectedBatch
    );
    const selectedProductData = products.find(
      (p) => p.id.toString() === selectedProduct
    );

    if (!selectedBatchData || !selectedProductData) {
      alert("Invalid batch or product selection");
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getFullYear()}`;

    const newEntry: ProductEntry = {
      productName: selectedProductData.nama,
      batchName: selectedBatchData.nama_batch,
      quantity: newProduct.quantity,
      distributionDate: formattedDate,
    };

    console.log("DEBUG 1: New entry being added:", newEntry);
    console.log(
      "DEBUG 2: Current productEntries before update:",
      productEntries
    );

    setProductEntries((prevEntries) => {
      const updatedEntries = [...prevEntries, newEntry];
      console.log("DEBUG 3: Updated productEntries:", updatedEntries);
      return updatedEntries;
    });

    // Log right after setting
    console.log(
      "DEBUG 4: productEntries right after setProductEntries:",
      productEntries
    );

    // Reset form
    setNewProduct({
      productName: "",
      batchName: "",
      quantity: "",
      distributionDate: "",
    });
    setSelectedProduct("");
    setSelectedBatch("");
    setIsModalOpen(false);
  };

  // In handleSaveDistribution:
  const handleSaveDistribution = async () => {
    console.log("DEBUG 5: Starting save with productEntries:", productEntries);

    if (productEntries.length === 0) {
      alert("No products to save.");
      return;
    }

    console.log("DEBUG 6: Available batches:", allBatches);

    // Build the details array from product entries
    const distributionDetails = productEntries
      .map((entry) => {
        console.log("DEBUG 7: Processing entry:", entry);

        // Find the batch ID from allBatches array using the batch name
        const batch = allBatches.find((b) => b.nama_batch === entry.batchName);
        console.log("DEBUG 8: Found batch:", batch);

        if (!batch) {
          console.error("Batch not found for:", entry.batchName);
          return null;
        }

        return {
          batch_id: batch.batch_id,
          kuantitas_terjual: Number(entry.quantity),
        };
      })
      .filter(
        (detail): detail is NonNullable<typeof detail> => detail !== null
      );

    if (distributionDetails.length === 0) {
      alert("No valid products to save. Please check batch information.");
      return;
    }

    console.log("DEBUG 9: Final distributionDetails:", distributionDetails);

    // Create the payload for the API call
    const distribusiData = {
      outlet_id: Number(outletId),
      status_pembayaran: paymentStatus,
      tanggal_faktur: invoiceDate,
      tanggal_jatuh_tempo: dueDate,
      details: distributionDetails,
    };

    try {
      const response = await fetch("http://localhost:3008/api/distribusi", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(distribusiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();
      console.log("API response:", result);

      setProductEntries([]);
      setIsSaveModalOpen(false);
      await fetchDistributions();
      alert("Distribution saved successfully!");
    } catch (error) {
      console.error("Failed to save distribution:", error);
      alert(`Failed to save distribution: ${error}`);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Distribusi Baru</h3>
      <Divider className="mb-2" />

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Tambah Produk
        </Button>
      </div>

      {productEntries.length > 0 && (
        <>
          <Table aria-label="Pre-distribution">
            <TableHeader>
              <TableColumn>Nama Produk</TableColumn>
              <TableColumn>Nama Batch</TableColumn>
              <TableColumn>Kuantitas</TableColumn>
              <TableColumn>Tanggal Distribusi</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody>
              {productEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.productName}</TableCell>
                  <TableCell>{entry.batchName}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.distributionDate}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                if (productEntries.length > 0) {
                  setIsSaveModalOpen(true);
                } else {
                  alert(
                    "Silakan tambahkan produk sebelum menyimpan distribusi."
                  );
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Simpan Distribusi
            </Button>
          </div>
        </>
      )}

      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Detail Faktur
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tanggal Faktur
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tenggat Waktu
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status Pembayaran
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as "Lunas" | "Menunggu")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Lunas">Lunas</option>
                  <option value="Menunggu">Menunggu</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveDistribution}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Tambah Produk Baru
              </h3>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Produk
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Pilih Produk</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => handleBatchChange(e.target.value)}
                  disabled={!selectedProduct || loadingBatches}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">
                    {loadingBatches ? "Memuat batches..." : "Pilih Batch"}
                  </option>
                  {batches.map((batch) => (
                    <option
                      key={batch.batch_id}
                      value={batch.batch_id.toString()}
                    >
                      {batch.nama_batch} (kuantitas: {batch.kuantitas_batch},
                      kadaluarsa:{" "}
                      {new Date(batch.tanggal_kadaluarsa).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kuantitas
                </label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tambah
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold">Riwayat Distribusi</h3>
      <Divider className="mb-2" />
      <Table>
        <TableHeader>
          <TableColumn>Faktur id</TableColumn>
          <TableColumn>Batch id</TableColumn>
          <TableColumn>Dibuat pada</TableColumn>
          <TableColumn>Aksi</TableColumn>
        </TableHeader>
        <TableBody
          items={distributions}
          // Optional: Add loading state
          loadingContent={<p>Memuat distribusi...</p>}
          emptyContent={
            <div className="text-center p-4">
              <p>Tidak ditemukan catatan distribusi untuk outlet ini</p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.distribusi_id}>
              <TableCell>{item.faktur_id}</TableCell>
              <TableCell>{item.distribusi_id}</TableCell>
              <TableCell>{formatDate(item.distribusi_created_at)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleViewDetail(item.distribusi_id)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Detail
                  </Button>
                  <Button
                    onClick={() => handleViewFaktur(item.distribusi_id)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Faktur
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold">Detail Distribusi</h3>
              <Button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                Tutup
              </Button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b text-left px-4 py-2">Nama Batch</th>
                  <th className="border-b text-left px-4 py-2">Nama Produk</th>
                  <th className="border-b text-left px-4 py-2">Kuantitas</th>
                </tr>
              </thead>
              <tbody>
                {detailData?.map((detail) => (
                  <tr key={detail.batch_id}>
                    <td className="border-t px-4 py-2">{detail.batch_name}</td>
                    <td className="border-t px-4 py-2">
                      {detail.product_name}
                    </td>
                    <td className="border-t px-4 py-2">{detail.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFakturModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xl font-semibold">Detail Faktur</h3>
              <Button
                onClick={() => setIsFakturModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                Close
              </Button>
            </div>
            <div className="space-y-2">
              <p className="mb-2">
                Nomor Faktur: {fakturData?.[0]?.invoice_number}
              </p>
              <p className="mb-2">
                Tanggal Faktur: {formatDate(fakturData?.[0]?.invoice_date)}
              </p>
              <p className="mb-2">
                Waktu Tenggat: {formatDate(fakturData?.[0]?.due_date)}
              </p>

              <p className="mb-2">
                Nama Outlet: {fakturData?.[0]?.outlet_name}
              </p>
              <p className="mb-4">
                Alamat Outlet: {fakturData?.[0]?.outlet_address}
              </p>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b text-left px-4 py-2">
                      Nama Produk
                    </th>
                    <th className="border-b text-left px-4 py-2">kuantitas</th>
                    <th className="border-b text-left px-4 py-2">
                      Harga Satuan
                    </th>
                    <th className="border-b text-left px-4 py-2">
                      Total Harga
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fakturData?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border-t px-4 py-2">
                        {item.product_name}
                      </td>
                      <td className="border-t px-4 py-2">{item.quantity}</td>
                      <td className="border-t px-4 py-2">
                        {Number(item.unit_price).toLocaleString("id-ID", {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                      <td className="border-t px-4 py-2">
                        {Number(item.total_price).toLocaleString("id-ID", {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 space-y-2">
                <p>
                  <strong>Grand Total:</strong>{" "}
                  {Number(fakturData?.[0]?.grand_total).toLocaleString(
                    "id-ID",
                    {
                      minimumFractionDigits: 0,
                    }
                  )}
                </p>
                <p>
                  <strong>Amount Paid:</strong>{" "}
                  {Number(fakturData?.[0]?.amount_paid).toLocaleString(
                    "id-ID",
                    {
                      minimumFractionDigits: 0,
                    }
                  )}
                </p>
                <p>
                  <strong>Balance Due:</strong>{" "}
                  {Number(fakturData?.[0]?.balance_due).toLocaleString(
                    "id-ID",
                    {
                      minimumFractionDigits: 0,
                    }
                  )}
                </p>
                <p>
                  <strong>Status Pembayaran:</strong>{" "}
                  {fakturData?.[0]?.payment_status}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributionHistory;
