"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi elemen Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FinancialReports: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");

  const data = {
    labels: ["Outlet 1", "Outlet 2", "Outlet 3", "Outlet 4"],
    datasets: [
      {
        label: "Revenue",
        data: [20000, 50000, 40000, 70000, 30000, 40000], // Ganti dengan data Anda
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        tension: 0.4, // Membuat kurva halus
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Sembunyikan legenda
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80000, // Skala maksimal sesuai kebutuhan
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Financial Reports</h2>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          {/* Tambahkan bulan lainnya sesuai kebutuhan */}
        </select>
      </div>
      <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "20px", marginTop: "20px" }}>
        <h3>{selectedMonth}</h3>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default FinancialReports;