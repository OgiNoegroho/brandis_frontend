"use client";

import React from 'react';

interface HelloUserManagementProps {
  name?: string;
}

const HelloUserManagement: React.FC<HelloUserManagementProps> = ({ name = "User Management" }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default HelloUserManagement;
