"use client";
import React from 'react';

interface HelloInventoryProps {
  name?: string;
}

const HelloInventory: React.FC<HelloInventoryProps> = ({ name = "Inventory" }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default HelloInventory;
