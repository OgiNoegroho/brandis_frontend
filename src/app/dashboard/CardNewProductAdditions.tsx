'use client';

import React from "react";
import { useGetNewProductsQuery } from "@/app/redux/api"; // Adjust the import path


const CardNewProductAdditions = () => {
  const { data: newProducts = [], isLoading, error } = useGetNewProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="card">
      <div className="header">
        <h2>New Product Additions</h2>
      </div>
      <div className="body">
        <ul>
          {newProducts.length === 0 ? (
            <li>No new products added in the last 30 days</li>
          ) : (
            newProducts.map((product) => (
              <li key={product.productId}>
                {product.name} - ${product.price}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CardNewProductAdditions;
