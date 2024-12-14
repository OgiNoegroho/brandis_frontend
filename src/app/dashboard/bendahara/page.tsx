
"use client"

import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Bendahara: React.FC = () => {
  // Dummy Data

  // Total Penjualan Mingguan dari Setiap Outlet
  const penjualanMingguan = [
    { nama_outlet: "Outlet Utama", minggu: "2024-12-02", total_penjualan_mingguan: 1000 },
    { nama_outlet: "Outlet Cabang 1", minggu: "2024-12-02", total_penjualan_mingguan: 700 },
    { nama_outlet: "Outlet Cabang 2", minggu: "2024-12-02", total_penjualan_mingguan: 500 },
  ];

  // Total Macam Produk dan Jenisnya
  const totalProdukDanJenis = {
    total_macam_produk: 20,
    total_jenis_kategori: 6,
  };

  // Grafik Penjualan Setiap Outlet (per Hari)
  const grafikPenjualanOutlet = [
    { nama_outlet: "Outlet Utama", tanggal: "2024-12-08", total_penjualan: 300 },
    { nama_outlet: "Outlet Cabang 1", tanggal: "2024-12-08", total_penjualan: 200 },
    { nama_outlet: "Outlet Utama", tanggal: "2024-12-07", total_penjualan: 250 },
    { nama_outlet: "Outlet Cabang 1", tanggal: "2024-12-07", total_penjualan: 150 },
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
      <h1>Dashboard Bendahara</h1>

      {/* Total Penjualan Mingguan */}
      <section>
        <h2>Total Penjualan Mingguan dari Setiap Outlet</h2>
        <table border={1} cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Nama Outlet</th>
              <th>Minggu</th>
              <th>Total Penjualan Mingguan</th>
            </tr>
          </thead>
          <tbody>
            {penjualanMingguan.map((penjualan, index) => (
              <tr key={index}>
                <td>{penjualan.nama_outlet}</td>
                <td>{penjualan.minggu}</td>
                <td>{penjualan.total_penjualan_mingguan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Total Produk */}
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
    </div>
  );
};

export default Bendahara;
