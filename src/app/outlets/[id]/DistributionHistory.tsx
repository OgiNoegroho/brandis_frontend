import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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
  faktur_id: string;
  details: { batch_id: number; kuantitas_terjual: number }[];
};

type Product = {
  id: number;
  nama: string;
};

type Batch = {
  batch_id: number;
  nama_batch: string;
  kuantitas_batch: number;
};

type Faktur = {
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

interface DistributionHistoryProps {
  outletId: string;
}

const DistributionHistory: React.FC<DistributionHistoryProps> = ({ outletId }) => {
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([]);
  const [savedDistributions, setSavedDistributions] = useState<SavedDistribution[]>([]);
  const [distributions, setDistributions] = useState<DistributionTableEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [isFakturModalOpen, setIsFakturModalOpen] = useState(false);
const [detailData, setDetailData] = useState<DistributionDetailEntry[] | null>(null);
const [fakturData, setFakturData] = useState<FakturEntry[] | null>(null);


  const [newProduct, setNewProduct] = useState<ProductEntry>({
    productName: "",
    batchName: "",
    quantity: "",
    distributionDate: "",
  });
  const [invoiceCode, setInvoiceCode] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"Lunas" | "Menunggu">("Menunggu");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);


  const formatDate = (date?: string | number | null) =>
    date ? new Date(date).toLocaleDateString() : "N/A";
  


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
      const response = await fetch(`http://localhost:3008/api/inventory/${productId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch batches");

      const data = await response.json();
      setBatches(data);
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

      const response = await fetch(`http://localhost:3008/api/distribusi/${outletIdNumber}`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });

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
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching distributions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  



  const handleViewDetail = async (distributionId: number) => {
    try {
      const response = await fetch(`http://localhost:3008/api/distribusi/detail/${distributionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch distribution details");
      }
  
      const data: DistributionDetailEntry[] = await response.json();
  
      // Validate response
      if (!Array.isArray(data) || data.some((entry) => !entry.batch_id || !entry.product_name || !entry.quantity)) {
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
      const response = await fetch(`http://localhost:3008/api/faktur/${distributionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch invoice details");
      }
  
      const data: FakturEntry[] = await response.json();
  
      // Validate response
      if (!Array.isArray(data) || data.some((entry) => !entry.invoice_number || !entry.invoice_date || !entry.grand_total)) {
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
    const product = products.find(p => p.id.toString() === productId);
    setNewProduct(prev => ({
      ...prev,
      productName: product ? product.nama : ""
    }));

    // Fetch batches for the selected product
    fetchBatches(productId);
  };

  // Handle batch selection
  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);
    
    // Find the selected batch name for display
    const batch = batches.find(b => b.batch_id.toString() === batchId);
    setNewProduct(prev => ({
      ...prev,
      batchName: batch ? batch.nama_batch : ""
    }));
  };

  // Function to handle adding a new product entry
  const handleAddProduct = () => {
    if (!selectedProduct || !selectedBatch || !newProduct.quantity) {
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;

    setProductEntries((prevEntries) => [
      ...prevEntries,
      { ...newProduct, distributionDate: formattedDate },
    ]);

    // Reset form
    setNewProduct({ productName: "", batchName: "", quantity: "", distributionDate: "" });
    setSelectedProduct("");
    setSelectedBatch("");
    setIsModalOpen(false);
  };

  // Function to remove a product entry
  const handleRemoveProduct = (index: number) => {
    setProductEntries((prevEntries) => prevEntries.filter((_, i) => i !== index));
  };


  
  // Function to save distribution (call API)
  const handleSaveDistribution = async () => {
    if (productEntries.length === 0) {
      console.error("No products to save.");
      return;
    }
  
    if (!invoiceCode.trim() || !invoiceDate || !dueDate || !paymentStatus) {
      alert("Please fill in all invoice details.");
      return;
    }
  
    const distributionDetails = productEntries
      .map((entry) => {
        const batch = batches.find((b) => b.nama_batch === entry.batchName);
  
        if (!batch) {
          console.error("Batch not found for batch name:", entry.batchName);
          return null;
        }
  
        const quantity = Number(entry.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          console.error("Invalid quantity:", entry.quantity);
          return null;
        }
  
        return {
          batch_id: batch.batch_id,
          kuantitas_terjual: quantity,
        };
      })
      .filter((detail) => detail !== null) as { batch_id: number; kuantitas_terjual: number }[];
  
    if (distributionDetails.length === 0) {
      console.error("No valid distribution details.");
      return;
    }
  
    const distribusiData = {
      outlet_id: Number(outletId),
      faktur_id: invoiceCode.trim(),
      status_pembayaran: paymentStatus,
      tanggal_faktur: invoiceDate,
      tanggal_jatuh_tempo: dueDate,
      details: distributionDetails,
    };
  
    console.log("Payload being sent:", JSON.stringify(distribusiData, null, 2));
  
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
        console.error("API error:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"}`
        );
      }
  
      const result = await response.json();
      console.log("API response:", result);
  
      if (!result || !result.faktur_id) {
        console.error("Invalid response structure or missing faktur_id.");
        alert("Failed to save distribution: Invalid server response.");
        return;
      }
  
      setSavedDistributions((prevDistributions) => [
        ...prevDistributions,
        {
          faktur_id: result?.faktur_id || "Unknown",
          details: distributionDetails,
        },
      ]);
  
      setProductEntries([]);
      setIsSaveModalOpen(false);
    } catch (error) {
      console.error("Failed to save distribution:", error);
      alert(`Failed to save distribution: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">New Distribution Entry</h3>
        <h4 className="text-md font-semibold mb-4">Outlet ID: {outletId}</h4> {/* Displaying outletId */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Product
          </button>
        </div>

        {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Invoice Code</label>
                <input
                  type="text"
                  value={invoiceCode}
                  onChange={(e) => setInvoiceCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as "Lunas" | "Menunggu")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Lunas">Lunas</option>
                  <option value="Menunggu">Menunggu</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDistribution}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="border-b px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">Add New Product</h3>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Batch Name</label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => handleBatchChange(e.target.value)}
                    disabled={!selectedProduct || loadingBatches}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">
                      {loadingBatches ? "Loading batches..." : "Select Batch"}
                    </option>
                    {batches.map((batch) => (
                      <option 
                        key={batch.batch_id} 
                        value={batch.batch_id.toString()}
                      >
                        {batch.nama_batch} (Qty: {batch.kuantitas_batch})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display pre-distribution table */}
        <h4 className="text-lg font-semibold mb-4">Pre-distribution</h4>
        <Table aria-label="Pre-distribution">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Batch Name</TableColumn>
            <TableColumn>Quantity</TableColumn>
            <TableColumn>Distribution Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {productEntries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.productName}</TableCell>
                <TableCell>{entry.batchName}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>{entry.distributionDate}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleRemoveProduct(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {productEntries.length > 0 && (
  <div className="flex justify-end mt-4">
    <button
      onClick={() => setIsSaveModalOpen(true)}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      Save Distribution
    </button>
  </div>
)}

      </div>

      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
  <h3 className="text-lg font-semibold mb-4">Distribution History</h3>
  <Table>
    <TableHeader>
      <TableColumn>ID</TableColumn>
      <TableColumn>Created At</TableColumn>
      <TableColumn>Actions</TableColumn>
    </TableHeader>
    <TableBody 
      items={distributions}
      // Optional: Add loading state
      loadingContent={<p>Loading distributions...</p>}
      emptyContent={
        <div className="text-center p-4">
          <p>No distribution records found for this outlet</p>
        </div>
      }
    >
      {(item) => (
        <TableRow key={item.distribusi_id}>
          <TableCell>{item.distribusi_id}</TableCell>
          <TableCell>
            {formatDate(item.distribusi_created_at)}
          </TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleViewDetail(item.distribusi_id)}
                className="text-blue-600 hover:text-blue-800"
              >
                View Details
              </button>
              <button 
                onClick={() => handleViewFaktur(item.distribusi_id)}
                className="text-green-600 hover:text-green-800"
              >
                View Faktur
              </button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>

{isDetailModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-4">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h3 className="text-xl font-semibold">Distribution Details</h3>
        <button
          onClick={() => setIsDetailModalOpen(false)}
          className="text-red-500 hover:text-red-700"
        >
          Close
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b text-left px-4 py-2">Batch Name</th>
            <th className="border-b text-left px-4 py-2">Product Name</th>
            <th className="border-b text-left px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {detailData?.map((detail) => (
            <tr key={detail.batch_id}>
              <td className="border-t px-4 py-2">{detail.batch_name}</td>
              <td className="border-t px-4 py-2">{detail.product_name}</td>
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
        <h3 className="text-xl font-semibold">Invoice Details</h3>
        <button
          onClick={() => setIsFakturModalOpen(false)}
          className="text-red-500 hover:text-red-700"
        >
          Close
        </button>
      </div>
      <p className="mb-2">Invoice Number: {fakturData?.[0]?.invoice_number}</p>
      <p className="mb-2">Invoice Date: {formatDate(fakturData?.[0]?.invoice_date)}</p>
<p className="mb-2">Due Date: {formatDate(fakturData?.[0]?.due_date)}</p>

      <p className="mb-2">Outlet Name: {fakturData?.[0]?.outlet_name}</p>
      <p className="mb-4">Outlet Address: {fakturData?.[0]?.outlet_address}</p>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b text-left px-4 py-2">Product Name</th>
            <th className="border-b text-left px-4 py-2">Quantity</th>
            <th className="border-b text-left px-4 py-2">Unit Price</th>
            <th className="border-b text-left px-4 py-2">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {fakturData?.map((item, idx) => (
            <tr key={idx}>
              <td className="border-t px-4 py-2">{item.product_name}</td>
              <td className="border-t px-4 py-2">{item.quantity}</td>
              <td className="border-t px-4 py-2">{item.unit_price}</td>
              <td className="border-t px-4 py-2">{item.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}





    </div>
  );
};

export default DistributionHistory;
