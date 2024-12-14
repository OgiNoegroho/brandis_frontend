"use client"

import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Pimpinan: React.FC = () => {
  // Dummy data based on the query
  const produkData = [
    { id: 1, nama: "Sabun Herbal", gudang: 200, outlet: 150, total: 350 },
    { id: 2, nama: "Minuman Jamu", gudang: 100, outlet: 50, total: 150 },
    { id: 3, nama: "Body Lotion", gudang: 300, outlet: 100, total: 400 },
  ];

  const penjualanMingguan = [
    { outlet: "Outlet Utama", minggu: "2024-12-02", total: 500 },
    { outlet: "Outlet Cabang 1", minggu: "2024-12-02", total: 300 },
    { outlet: "Outlet Cabang 2", minggu: "2024-12-02", total: 200 },
  ];

  const grafikPenjualan = [
    { outlet: "Outlet Utama", tanggal: "2024-12-08", total: 100 },
    { outlet: "Outlet Cabang 1", tanggal: "2024-12-08", total: 80 },
    { outlet: "Outlet Utama", tanggal: "2024-12-07", total: 120 },
  ];

  const userRoles = [
    { role: "Admin Produksi", total: 2 },
    { role: "Admin Gudang", total: 3 },
    { role: "Marketing", total: 4 },
    { role: "Bendahara", total: 1 },
    { role: "Reseller", total: 10 },
  ];

  // Chart Data for Grafik Penjualan
  const chartData = {
    labels: grafikPenjualan.map((item) => item.tanggal),
    datasets: [
      {
        label: "Penjualan Outlet Utama",
        data: grafikPenjualan
          .filter((item) => item.outlet === "Outlet Utama")
          .map((item) => item.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Penjualan Outlet Cabang 1",
        data: grafikPenjualan
          .filter((item) => item.outlet === "Outlet Cabang 1")
          .map((item) => item.total),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Brandis</h1>

      {/* Total Produk */}
      <section>
        <h2>Total Kuantitas Produk</h2>
        <table border={1} cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Produk ID</th>
              <th>Nama Produk</th>
              <th>Kuantitas Gudang</th>
              <th>Kuantitas Outlet</th>
              <th>Total Kuantitas</th>
            </tr>
          </thead>
          <tbody>
            {produkData.map((produk) => (
              <tr key={produk.id}>
                <td>{produk.id}</td>
                <td>{produk.nama}</td>
                <td>{produk.gudang}</td>
                <td>{produk.outlet}</td>
                <td>{produk.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Penjualan Mingguan */}
      <section>
        <h2>Penjualan Mingguan</h2>
        <table border={1} cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Nama Outlet</th>
              <th>Minggu</th>
              <th>Total Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {penjualanMingguan.map((penjualan, index) => (
              <tr key={index}>
                <td>{penjualan.outlet}</td>
                <td>{penjualan.minggu}</td>
                <td>{penjualan.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Grafik Penjualan */}
      <section>
        <h2>Grafik Penjualan</h2>
        <Bar data={chartData} options={{ responsive: true }} />
      </section>

      {/* User per Role */}
      <section>
        <h2>Total User per Role</h2>
        <table border={1} cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Role</th>
              <th>Total User</th>
            </tr>
          </thead>
          <tbody>
            {userRoles.map((role, index) => (
              <tr key={index}>
                <td>{role.role}</td>
                <td>{role.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Pimpinan;
