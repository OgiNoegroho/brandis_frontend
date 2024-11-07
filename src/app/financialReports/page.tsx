"use client";
import React from 'react';

interface HelloFinancialReportsProps {
  name?: string;
}

const HelloFinancialReports: React.FC<HelloFinancialReportsProps> = ({ name = "Financial Reports" }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default HelloFinancialReports;
