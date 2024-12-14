
"use client"

import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Pemasaran: React.FC = () => {
  // Dummy Data

  // Total Macam Produk dan Jenisnya
  const totalProdukDanJenis = {
    total_macam_produk: 15,
    total_jenis_kategori: 5,
  };

  // Grafik Penjualan Setiap Outlet (per Hari)
  const grafikPenjualanOutlet = [
    { nama_outlet: "Outlet Utama", tanggal: "2024-12-08", total_penjualan: 120 },
    { nama_outlet: "Outlet Cabang 1", tanggal: "2024-12-08", total_penjualan: 80 },
    { nama_outlet: "Outlet Utama", tanggal: "2024-12-07", total_penjualan: 100 },
    { nama_outlet: "Outlet Cabang 1", tanggal: "2024-12-07", total_penjualan: 70 },
  ];

  // Batch Produk yang 30 Hari Menuju Kadaluarsa
  const batchKadaluarsa = [
    { nama_batch: "Batch A", nama_produk: "Sabun Herbal", tanggal_kadaluarsa: "2024-12-20" },
    { nama_batch: "Batch B", nama_produk: "Minuman Jamu", tanggal_kadaluarsa: "2024-12-25" },
    { nama_batch: "Batch C", nama_produk: "Body Lotion", tanggal_kadaluarsa: "2024-12-30" },
  ];

  // Chart Data for Grafik Penjualan
  const chartData = {
    labels: [...new Set(grafikPenjualanOutlet.map((item) => item.tanggal))],
    datasets: [
      {
        label: "Outlet Utama",
        data: grafikPenjualanOutlet
          .filter((item) => item.nama_outlet === "Outlet Utama")
          .map((item) => item.total_penjualan),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Outlet Cabang 1",
        data: grafikPenjualanOutlet
          .filter((item) => item.nama_outlet === "Outlet Cabang 1")
          .map((item) => item.total_penjualan),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Pemasaran</h1>

      {/* Total Macam Produk dan Jenisnya */}
      <section>
        <h2>Total Produk</h2>
        <div>
          <p>Total Macam Produk: {totalProdukDanJenis.total_macam_produk}</p>
          <p>Total Jenis Kategori: {totalProdukDanJenis.total_jenis_kategori}</p>
        </div>
      </section>

      {/* Grafik Penjualan */}
      <section>
        <h2>Grafik Penjualan Setiap Outlet (per Hari)</h2>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </section>

      {/* Batch Kadaluarsa */}
      <section>
        <h2>Batch Produk Mendekati Kadaluarsa</h2>
        <table border={1} cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Nama Batch</th>
              <th>Nama Produk</th>
              <th>Tanggal Kadaluarsa</th>
            </tr>
          </thead>
          <tbody>
            {batchKadaluarsa.map((batch, index) => (
              <tr key={index}>
                <td>{batch.nama_batch}</td>
                <td>{batch.nama_produk}</td>
                <td>{batch.tanggal_kadaluarsa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Pemasaran;
