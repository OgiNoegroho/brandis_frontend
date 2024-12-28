import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Input,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { showSuccessToast, showErrorToast } from "@/redux/slices/toastSlice";

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
  payment_status: "Lunas" | "Belum Lunas";
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
  const [distributions, setDistributions] = useState<DistributionTableEntry[]>(
    []
  );
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
  const [paymentStatus, setPaymentStatus] = useState<"Lunas" | "Belum Lunas">(
    "Belum Lunas"
  );
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const formatDate = (date?: string | number | null) => {
    if (!date) return "N/A";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [loadingBatches, setLoadingBatches] = useState(false);

  const dispatch = useAppDispatch();

  const token = useAppSelector((state: RootState) => state.auth.token);
    const isDarkMode = useAppSelector(
      (state: RootState) => state.global.isDarkMode
    );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
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
  const fetchBatches = async (productId: string) => {
    setLoadingBatches(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch batches");

      const data: Batch[] = await response.json();

      setBatches(data);
      setAllBatches((prevBatches) => {

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

  useEffect(() => {
    if (outletId) {
      fetchDistributions();
    }
  }, [outletId, token]);

  const fetchDistributions = async () => {

    try {
      const outletIdNumber = Number(outletId);

      if (isNaN(outletIdNumber)) {
        throw new Error("Invalid outlet ID");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/distribusi/${outletIdNumber}`,
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

      if (!Array.isArray(data)) {
        throw new Error("Invalid response structure: expected an array");
      }

      setDistributions(data);
    } catch (error) {
          dispatch(
            showErrorToast({ message: "Failed to load products", isDarkMode })
          );
        }
      };

  const handleViewDetail = async (distributionId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/distribusi/detail/${distributionId}`,
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
    }
  };

  const handleViewFaktur = async (distributionId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/faktur/${distributionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch invoice details");
      }

      const data: FakturEntry[] = await response.json();

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
    }
  };


  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    setSelectedBatch("");

    const product = products.find((p) => p.id.toString() === productId);
    setNewProduct((prev) => ({
      ...prev,
      productName: product ? product.nama : "",
    }));

    fetchBatches(productId);
  };

  const handleBatchChange = (batchId: string) => {
    setSelectedBatch(batchId);

    const batch = batches.find((b) => b.batch_id.toString() === batchId);
    setNewProduct((prev) => ({
      ...prev,
      batchName: batch ? batch.nama_batch : "",
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setProductEntries((prevEntries) =>
      prevEntries.filter((_, i) => i !== index)
    );
  };

  const handleAddProduct = () => {
    if (!selectedProduct || !selectedBatch || !newProduct.quantity) {
      alert("Please fill in all product details");
      return;
    }

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/distribusi`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(distribusiData),
        }
      );

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

      // Reset form and fetch updated distributions
      setProductEntries([]);
      setIsSaveModalOpen(false);
      await fetchDistributions();

      // Show success toast
      dispatch(
        showSuccessToast({
          message: "Distribution saved successfully!",
          isDarkMode,
        })
      );
    } catch (error) {
      console.error("Failed to save distribution:", error);

      // Show error toast
      dispatch(
        showErrorToast({
          message: `Failed to save distribution: ${error || error}`,
          isDarkMode,
        })
      );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Distribusi Baru</h3>
      <Divider className="mb-2" />

      <div className="flex justify-end mb-4">
        <Button
          onPress={() => setIsModalOpen(true)}
          color="success"
          variant="flat"
        >
          Tambah Distribusi
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
                      onPress={() => handleRemoveProduct(index)}
                      color="danger"
                      variant="light"
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
              onPress={() => {
                if (productEntries.length > 0) {
                  setIsSaveModalOpen(true);
                } else {
                  alert(
                    "Silakan tambahkan produk sebelum menyimpan distribusi."
                  );
                }
              }}
              color="primary"
              variant="flat"
            >
              Simpan Distribusi
            </Button>
          </div>
        </>
      )}

      {isSaveModalOpen && (
        <Modal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          closeButton
        >
          <ModalContent>
            <ModalHeader>
              <h3 className="text-xl font-semibold">Detail Faktur</h3>
            </ModalHeader>
            <ModalBody>
              <Input
                type="date"
                label="Tanggal Faktur"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
              <Input
                type="date"
                label="Tenggat Waktu"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Select
                label="Status Pembayaran"
                placeholder="Pilih Status"
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as "Lunas" | "Belum Lunas")
                }
              >
                <SelectItem key="Lunas" value="Lunas">
                  Lunas
                </SelectItem>
                <SelectItem key="Belum Lunas" value="Belum Lunas">
                  Belum Lunas
                </SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => setIsSaveModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                color="primary"
                variant="flat"
                onPress={handleSaveDistribution}
              >
                Simpan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          closeButton
        >
          <ModalContent>
            <ModalHeader>
              <h3 className="text-xl font-semibold">Tambah Distribusi Baru</h3>
            </ModalHeader>
            <ModalBody>
              <Select
                label="Nama Produk"
                placeholder="Pilih Produk"
                value={selectedProduct}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.nama}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Nama Batch"
                placeholder={
                  loadingBatches ? "Memuat batches..." : "Pilih Batch"
                }
                value={selectedBatch}
                disabled={!selectedProduct || loadingBatches}
                onChange={(e) => handleBatchChange(e.target.value)}
              >
                {batches.map((batch) => (
                  <SelectItem
                    key={batch.batch_id}
                    value={batch.batch_id.toString()}
                  >
                    {batch.nama_batch} (kuantitas: {batch.kuantitas_batch},
                    kadaluarsa:{" "}
                    {new Date(batch.tanggal_kadaluarsa).toLocaleDateString()})
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="number"
                label="Kuantitas"
                value={newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, quantity: e.target.value })
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button color="primary" variant="flat" onPress={handleAddProduct}>
                Tambah
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      <h3 className="text-lg font-semibold">Riwayat Distribusi</h3>
      <Divider className="mb-2" />
      <Table>
        <TableHeader>
          <TableColumn>No Faktur</TableColumn>
          <TableColumn>No Distribusi</TableColumn>
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
                    onPress={() => handleViewDetail(item.distribusi_id)}
                    color="primary"
                    variant="flat"
                  >
                    Detail
                  </Button>
                  <Button
                    onPress={() => handleViewFaktur(item.distribusi_id)}
                    color="success"
                    variant="flat"
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
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          aria-labelledby="detail-modal-title"
        >
          <ModalContent>
            <ModalHeader>
              <h3 id="detail-modal-title" className="text-xl font-semibold">
                Detail Distribusi
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {detailData?.map((detail) => (
                  <div key={detail.batch_id} className="space-y-2">
                    <p>
                      <strong>Nomor Batch:</strong> {detail.batch_name}
                    </p>
                    <p>
                      <strong>Nama Produk:</strong> {detail.product_name}
                    </p>
                    <p>
                      <strong>Kuantitas:</strong> {detail.quantity}
                    </p>
                    <Divider />
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={() => setIsDetailModalOpen(false)}
                color="danger"
                variant="flat"
              >
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {isFakturModalOpen && (
        <Modal
          isOpen={isFakturModalOpen}
          onClose={() => setIsFakturModalOpen(false)}
          aria-labelledby="faktur-modal-title"
        >
          <ModalContent>
            <ModalHeader>
              <h3 id="faktur-modal-title" className="text-xl font-semibold">
                Detail Faktur
              </h3>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p>
                  <strong>Nomor Faktur:</strong>{" "}
                  {fakturData?.[0]?.invoice_number}
                </p>
                <p>
                  <strong>Tanggal Faktur:</strong>{" "}
                  {formatDate(fakturData?.[0]?.invoice_date)}
                </p>
                <p>
                  <strong>Waktu Tenggat:</strong>{" "}
                  {formatDate(fakturData?.[0]?.due_date)}
                </p>
                <p>
                  <strong>Nama Outlet:</strong> {fakturData?.[0]?.outlet_name}
                </p>
                <p>
                  <strong>Alamat Outlet:</strong>{" "}
                  {fakturData?.[0]?.outlet_address}
                </p>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b text-left px-4 py-2">
                        Nama Produk
                      </th>
                      <th className="border-b text-left px-4 py-2">
                        kuantitas
                      </th>
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
                    <strong>Total Harga:</strong>{" "}
                    {Number(fakturData?.[0]?.grand_total).toLocaleString(
                      "id-ID",
                      { minimumFractionDigits: 0 }
                    )}
                  </p>
                  <p>
                    <strong>Jumlah Dibayar:</strong>{" "}
                    {Number(fakturData?.[0]?.amount_paid).toLocaleString(
                      "id-ID",
                      { minimumFractionDigits: 0 }
                    )}
                  </p>
                  <p>
                    <strong>Jumlah Tagihan:</strong>{" "}
                    {Number(fakturData?.[0]?.balance_due).toLocaleString(
                      "id-ID",
                      { minimumFractionDigits: 0 }
                    )}
                  </p>
                  <p>
                    <strong>Status Pembayaran:</strong>{" "}
                    {fakturData?.[0]?.payment_status}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                onPress={() => setIsFakturModalOpen(false)}
                color="danger"
                variant="flat"
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default DistributionHistory;
