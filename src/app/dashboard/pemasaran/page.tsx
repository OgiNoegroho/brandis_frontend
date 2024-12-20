"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FaWarehouse, FaArrowDown, FaTrophy, FaUndo } from "react-icons/fa";

const Pemasaran: React.FC = () => {
  const [totalStokOutlet, setTotalStokOutlet] = useState<number | null>(null);
  const [outletStokRendah, setOutletStokRendah] = useState<any[]>([]);
  const [outletTerbaik, setOutletTerbaik] = useState<any>(null);
  const [outletTerendah, setOutletTerendah] = useState<any>(null);
  const [totalProdukDikembalikan, setTotalProdukDikembalikan] = useState<
    number | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const token = useAppSelector((state: RootState) => state.auth.token);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Total Stok Outlet
      const stokOutletRes = await fetch(
        "http://localhost:3008/api/dashboard/totalStokOutlet",
        { headers }
      );
      const stokOutletData = await stokOutletRes.json();
      setTotalStokOutlet(stokOutletData[0]?.total_stok_outlet || 0);

      // Outlet dengan Stok Rendah
      const stokRendahRes = await fetch(
        "http://localhost:3008/api/dashboard/outletStokRendah",
        { headers }
      );
      const stokRendahData = await stokRendahRes.json();
      setOutletStokRendah(stokRendahData);

      // Penjualan Outlet Terbaik
      const outletTerbaikRes = await fetch(
        "http://localhost:3008/api/dashboard/outletTerbaik",
        { headers }
      );
      const outletTerbaikData = await outletTerbaikRes.json();
      setOutletTerbaik(outletTerbaikData[0]);

      // Penjualan Outlet Terendah
      const outletTerendahRes = await fetch(
        "http://localhost:3008/api/dashboard/outletTerendah",
        { headers }
      );
      const outletTerendahData = await outletTerendahRes.json();
      setOutletTerendah(outletTerendahData[0]);

      // Total Produk Dikembalikan
      const produkDikembalikanRes = await fetch(
        "http://localhost:3008/api/dashboard/totalProdukDikembalikan",
        { headers }
      );
      const produkDikembalikanData = await produkDikembalikanRes.json();
      setTotalProdukDikembalikan(
        produkDikembalikanData[0]?.total_produk_dikembalikan || 0
      );
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div className="p-5 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-600 drop-shadow-sm">
        Dashboard Pemasaran
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Stok Outlet */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6 text-center">
          <FaWarehouse className="text-indigo-500 text-4xl mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">
            Total Stok Outlet
          </h2>
          <p className="text-3xl font-bold text-indigo-800 mt-2">
            {totalStokOutlet !== null ? totalStokOutlet : "Loading..."}
          </p>
        </div>

        {/* Outlet dengan Stok Rendah */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6">
          <FaArrowDown className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
            Outlet dengan Stok Rendah
          </h2>
          {outletStokRendah && outletStokRendah.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm text-center border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border border-gray-200">
                      Nama Outlet
                    </th>
                    <th className="px-4 py-2 border border-gray-200">Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {outletStokRendah.map((outlet, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-2 border border-gray-200">
                        {outlet.outlet_nama}
                      </td>
                      <td className="px-4 py-2 border border-gray-200">
                        {outlet.stok}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No outlet with low stock found.
            </p>
          )}
        </div>

        {/* Penjualan Outlet Terbaik */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6 text-center">
          <FaTrophy className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">
            Penjualan Outlet Terbaik
          </h2>
          {outletTerbaik ? (
            <>
              <p className="text-xl font-bold text-indigo-800">
                {outletTerbaik.outlet_nama}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                {outletTerbaik.total_terjual} Terjual
              </p>
            </>
          ) : (
            <p className="text-gray-500">No best selling outlet found.</p>
          )}
        </div>
      </div>

      {/* Bottom Two Containers */}
      <div className="flex justify-center gap-6 mt-8">
        {/* Penjualan Outlet Terendah */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6 text-center">
          <FaArrowDown className="text-gray-500 text-4xl mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">
            Penjualan Outlet Terendah
          </h2>
          {outletTerendah ? (
            <>
              <p className="text-xl font-bold text-red-800">
                {outletTerendah.outlet_nama}
              </p>
              <p className="text-lg text-gray-600 mt-2">
                {outletTerendah.total_terjual} Terjual
              </p>
            </>
          ) : (
            <p className="text-gray-500">No lowest selling outlet found.</p>
          )}
        </div>

        {/* Total Produk Dikembalikan */}
        <div className="bg-gray-50 rounded-lg shadow-lg p-6 text-center">
          <FaUndo className="text-indigo-500 text-4xl mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700">
            Total Produk Dikembalikan
          </h2>
          <p className="text-3xl font-bold text-indigo-800 mt-2">
            {totalProdukDikembalikan !== null
              ? totalProdukDikembalikan
              : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pemasaran;
