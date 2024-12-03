'use client';

import React from "react";
import { useGetLowStockProductsQuery } from "@/app/redux/api"; // Adjust the import path

const CardStockStatus = () => {
  const { data: lowStockProducts = [], isLoading, error } = useGetLowStockProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="card">
      <div className="header">
        <h2>Low Stock Products</h2>
      </div>
      <div className="body">
        {lowStockProducts.length === 0 ? (
          <p>No products with low stock</p>
        ) : (
          <ul>
            {lowStockProducts.map((product) => (
              <li key={product.productId}>
                {product.name} - {product.stockQuantity} in stock
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CardStockStatus;
