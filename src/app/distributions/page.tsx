"use client";

"use client";
import React from 'react';

interface HelloDistributionsProps {
  name?: string;
}

const HelloDistributions: React.FC<HelloDistributionsProps> = ({ name = "Distributions" }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default HelloDistributions;
