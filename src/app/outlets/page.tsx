"use client";
import React from 'react';

interface HelloOutletsProps {
  name?: string;
}

const HelloOutlets: React.FC<HelloOutletsProps> = ({ name = "Outlets" }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default HelloOutlets;
