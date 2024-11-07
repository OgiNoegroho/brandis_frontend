"use client";
import React from 'react';

interface HelloProductsProps {
  name?: string;
}

const HelloProducts: React.FC<HelloProductsProps> = ({ name = "Products" }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default HelloProducts;
