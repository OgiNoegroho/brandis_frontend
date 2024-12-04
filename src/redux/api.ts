// src\app\redux\api.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Product type definition
export interface Product {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  createdAt?: string;
}

// SalesDetail type definition
export interface SalesDetail {
  productId: string;
  quantitySold: number;
  price: number;
  createdAt: string;
}

// Outlet performance type definition
export interface OutletPerformance {
  outletId: string;
  outletName: string;
  totalSold: number;
  revenue: number;
}

// Dashboard metrics for the specific card data
export interface DashboardMetrics {
  totalRevenue: number;
  totalProductsSold: number;
  lowStockProducts: Product[];
  newProducts: Product[];
  outletPerformance: OutletPerformance[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Sales", "Outlets"],
  endpoints: (build) => ({
    // Total Revenue Overview for the last 30 days
    getTotalRevenue: build.query<number, void>({
      query: () => "/sales/totalRevenue",
      providesTags: ["Sales"],
    }),

    // Total Products Sold for the last 30 days
    getTotalProductsSold: build.query<number, void>({
      query: () => "/sales/totalProductsSold",
      providesTags: ["Sales"],
    }),

    // Products with stock status (In stock, Low stock, Out of stock)
    getLowStockProducts: build.query<Product[], void>({
      query: () => "/products/lowStock",
      providesTags: ["Products"],
    }),

    // Recently added products (within the last 30 days)
    getNewProducts: build.query<Product[], void>({
      query: () => "/products/new",
      providesTags: ["Products"],
    }),

    // Outlet Performance based on total sold quantity and revenue
    getOutletPerformance: build.query<OutletPerformance[], void>({
      query: () => "/outlets/performance",
      providesTags: ["Outlets"],
    }),

  }),
});

export const {
  useGetTotalRevenueQuery,
  useGetTotalProductsSoldQuery,
  useGetLowStockProductsQuery,
  useGetNewProductsQuery,
  useGetOutletPerformanceQuery,
} = api;
