import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface Product {
  product_id: number;
  product_name: string;
}

interface Batch {
  batch_id: number;
  batch_name: string;
  kuantitas: number;
}

interface NewReturn {
  outletId: string;
  productId: number | null;
  batchId: number | null;
  quantity: number;
  reason: string;
  returnDate: string;
}

interface ReturnHistory {
  return_id: number;
  outlet_id: number;
  batch_id: number;
  quantity: number;
  reason: string;
  return_date: string;
  product_name: string;
}

const ReturnManagement: React.FC<{ outletId: string }> = ({ outletId }) => {
  const token = useAppSelector((state: RootState) => state.auth.token);
  const [returnData, setReturnData] = useState<ReturnHistory[]>([]);
  const [returnHistory, setReturnHistory] = useState<ReturnHistory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReturn, setNewReturn] = useState<NewReturn>({
    outletId: outletId,
    productId: null,
    batchId: null,
    quantity: 0,
    reason: "",
    returnDate: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [error, setError] = useState<string | null>(null); // Added error state

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3008/api/returns/${outletId}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");
        const productsList = await response.json();
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching products. Please try again later.");
      }
    };

    if (outletId) fetchProducts();
  }, [outletId, token]);

  // Fetch batches when product changes
  useEffect(() => {
    const fetchBatches = async () => {
      if (!newReturn.productId) {
        setBatches([]);  // Clear batches if no product is selected
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3008/api/returns/${newReturn.productId}/batches`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch batches");
        const batchesList = await response.json();
        setBatches(batchesList);
      } catch (error) {
        console.error("Error fetching batches:", error);
        setBatches([]); // Reset batches if error occurs
        setError("Error fetching batches. Please try again later.");
      }
    };

    fetchBatches();
  }, [newReturn.productId, token]);

  // Fetch return history
  useEffect(() => {
    const fetchReturnHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3008/api/returns/${outletId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch return history");
        const history = await response.json();
        setReturnHistory(history);
      } catch (error) {
        console.error("Error fetching return history:", error);
        setError("Error fetching return history. Please try again later.");
      }
    };

    if (outletId) fetchReturnHistory();
  }, [outletId, token]);

  const handleAddReturn = () => {
    if (
      !newReturn.productId ||
      !newReturn.batchId ||
      !newReturn.quantity ||
      !newReturn.reason ||
      !newReturn.returnDate
    ) {
      setError("Please fill all fields");
      return;
    }

    const quantity = Number(newReturn.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError("Quantity must be a positive number");
      return;
    }

    const selectedProduct = products.find(p => p.product_id === newReturn.productId);
    const selectedBatch = batches.find(b => b.batch_id === newReturn.batchId);

    if (!selectedProduct || !selectedBatch) {
      setError("Invalid product or batch selection");
      return;
    }

    const newEntry: ReturnHistory = {
      return_id: Date.now(),
      product_name: selectedProduct.product_name,
      batch_id: selectedBatch.batch_id,
      quantity,
      reason: newReturn.reason,
      return_date: newReturn.returnDate,
      outlet_id: Number(outletId),
    };

    setReturnData(prev => [...prev, newEntry]);
    setIsModalOpen(false);
    resetForm();
    setError(null); // Clear error after successful return addition
  };

  const resetForm = () => {
    setNewReturn({
      outletId: outletId,
      productId: null,
      batchId: null,
      quantity: 0,
      reason: "",
      returnDate: "",
    });
  };

  const handleSaveReturns = async () => {
    if (returnData.length === 0) {
      setError("No returns to save");
      return;
    }
  
    try {
      // Prepare the return data according to the expected API format
      const returnRequestBody = returnData.map(item => ({
        outlet_id: item.outlet_id,
        batch_id: item.batch_id,
        kuantitas: item.quantity,  // 'quantity' renamed to 'kuantitas'
        alasan: item.reason,       // 'reason' renamed to 'alasan'
      }));
  
      // Log the request body to ensure it's being constructed correctly
      console.log("Return Request Body:", returnRequestBody);
  
      // Make the POST request to save returns
      const response = await fetch("http://localhost:3008/api/returns", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnRequestBody), // Send the return data as JSON
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error Response:", error); // Log the error response
        throw new Error(error.message || "Failed to save returns");
      }
  
      // Update return history with the newly saved returns
      setReturnHistory(prev => [...prev, ...returnData]);
      setReturnData([]);  // Clear return data after saving
      setError(null); // Clear error after successfully saving returns
    } catch (error) {
      console.error("Error saving returns:", error);
      setError(error instanceof Error ? error.message : "Failed to save returns");
    }
  };
  
  
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Return Management</h3>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add New Return
          </button>
        </div>

        <Table aria-label="Unsaved Returns">
  <TableHeader>
    <TableColumn>Product Name</TableColumn>
    <TableColumn>Batch</TableColumn>
    <TableColumn>Quantity</TableColumn>
    <TableColumn>Reason</TableColumn>
    <TableColumn>Return Date</TableColumn>
    <TableColumn>Action</TableColumn>
  </TableHeader>
  <TableBody>
  {returnData.map((item) => (
    <TableRow key={item.return_id}>
      <TableCell>{item.product_name}</TableCell>
      <TableCell>{item.batch_id}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.reason}</TableCell>
      <TableCell>{item.return_date}</TableCell>
      <TableCell>
        <button
          onClick={() =>
            setReturnData((prev) => prev.filter((r) => r.return_id !== item.return_id))
          }
          className="text-red-600 hover:underline"
        >
          Remove
        </button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

</Table>

{returnData.length > 0 && (
  <div className="flex justify-end mt-4">
    <button
      onClick={handleSaveReturns}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
    >
      Save Returns
    </button>
  </div>
)}

      </div>

      <div className="bg-white shadow-md p-4 rounded-lg mb-6">
<h3 className="text-lg font-semibold mt-6">Return History</h3>
<Table aria-label="Return History">
  <TableHeader>
    <TableColumn>Product Name</TableColumn>
    <TableColumn>Batch</TableColumn>
    <TableColumn>Quantity</TableColumn>
    <TableColumn>Reason</TableColumn>
    <TableColumn>Return Date</TableColumn>
  </TableHeader>
  <TableBody>
    {returnHistory.map((item) => (
      <TableRow key={item.return_id}>
        <TableCell>{item.product_name}</TableCell>
        <TableCell>{item.batch_id}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>{item.reason}</TableCell>
        <TableCell>{new Date(item.return_date).toISOString().split("T")[0]} {/* Format date */}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

</div>
    

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-semibold">Add New Return</h3>
            </div>
            <form key="return-form" className="px-6 py-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <select
                  value={newReturn.productId || ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : null;
                    setNewReturn(prev => ({
                      ...prev,
                      productId: value,
                      batchId: null,  // Reset batch when product changes
                    }));
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Product</option>
                  {products.map((product, index) => (
  <option key={`${product.product_id}-${index}`} value={product.product_id}>
    {product.product_name}
  </option>
))}

                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Batch</label>
                <select
                  value={newReturn.batchId || ""}
                  onChange={(e) => setNewReturn(prev => ({ ...prev, batchId: Number(e.target.value) }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.batch_id} value={batch.batch_id}>
                      {batch.batch_name} - {batch.kuantitas}
                    </option>
                  ))}
                </select>
              </div>

              <div>
  <label className="block text-sm font-medium">Quantity</label>
  <input
    type="number"
    value={newReturn.quantity}
    onChange={(e) =>
      setNewReturn(prev => ({
        ...prev,
        quantity: Number(e.target.value) || 0, // Convert input to a number
      }))
    }
    className="w-full p-2 border rounded-md"
    min="1"
  />
</div>


              <div>
                <label className="block text-sm font-medium">Reason</label>
                <input
                  type="text"
                  value={newReturn.reason}
                  onChange={(e) => setNewReturn(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Return Date</label>
                <input
                  type="date"
                  value={newReturn.returnDate}
                  onChange={(e) => setNewReturn(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="flex justify-end mt-4 space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddReturn}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnManagement;
