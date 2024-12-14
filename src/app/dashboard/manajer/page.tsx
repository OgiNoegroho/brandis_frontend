
"use client"

import React from "react";

const Manajer: React.FC = () => {
  // Dummy Data

  // Admin Gudang Data
  const totalProdukDanJenisGudang = {
    total_macam_produk: 10,
    total_jenis_kategori: 4,
  };

  const gudangData = [
    {
      produk_id: 1,
      nama_produk: "Sabun Herbal",
      total_kuantitas_gudang: 200,
      total_kuantitas_outlet: 150,
      total_kuantitas: 350,
    },
    {
      produk_id: 2,
      nama_produk: "Minuman Jamu",
      total_kuantitas_gudang: 100,
      total_kuantitas_outlet: 50,
      total_kuantitas: 150,
    },
    {
      produk_id: 3,
      nama_produk: "Body Lotion",
      total_kuantitas_gudang: 300,
      total_kuantitas_outlet: 200,
      total_kuantitas: 500,
    },
  ];

  // Admin Produksi Data
  const totalProdukDanJenisProduksi = {
    total_macam_produk: 10,
    total_jenis_kategori: 4,
  };

  const batchStatus = {
    total_batch_dibuat: 50,
    total_batch_belum_habis: 30,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Manajer</h1>

      {/* Admin Gudang Section */}
      <section>
        <h2>Admin Gudang</h2>
        <div>
          <p>Total Macam Produk: {totalProdukDanJenisGudang.total_macam_produk}</p>
          <p>Total Jenis Kategori: {totalProdukDanJenisGudang.total_jenis_kategori}</p>
        </div>
        <table border={1} cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Produk ID</th>
              <th>Nama Produk</th>
              <th>Total Kuantitas Gudang</th>
              <th>Total Kuantitas Outlet</th>
              <th>Total Kuantitas</th>
            </tr>
          </thead>
          <tbody>
            {gudangData.map((item) => (
              <tr key={item.produk_id}>
                <td>{item.produk_id}</td>
                <td>{item.nama_produk}</td>
                <td>{item.total_kuantitas_gudang}</td>
                <td>{item.total_kuantitas_outlet}</td>
                <td>{item.total_kuantitas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Admin Produksi Section */}
      <section>
        <h2>Admin Produksi</h2>
        <div>
          <p>Total Macam Produk: {totalProdukDanJenisProduksi.total_macam_produk}</p>
          <p>Total Jenis Kategori: {totalProdukDanJenisProduksi.total_jenis_kategori}</p>
        </div>
        <div>
          <p>Total Batch Dibuat: {batchStatus.total_batch_dibuat}</p>
          <p>Total Batch Belum Habis: {batchStatus.total_batch_belum_habis}</p>
        </div>
      </section>
    </div>
  );
};

export default Manajer;
