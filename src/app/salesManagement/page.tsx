"use client";
import React from "react";

interface HelloSalesManagementProps {
  name?: string;
}

const HelloSalesManagement: React.FC<HelloSalesManagementProps> = ({
  name = "Sales Management",
}) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default HelloSalesManagement;
