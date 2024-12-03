'use client';

import {
  Package,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import CardTotalRevenueOverview from "./CardTotalRevenueOverview";
import CardTotalProductsSold from "./CardTotalProductsSold";
import CardStockStatus from "./CardStockStatus";
import CardNewProductAdditions from "./CardNewProductAdditions";
import CardOutletPerformance from "./CardOutletPerformance";
import StatCard from "./StatCard";

const DashboardPage = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
        {/* Total Revenue Overview Card */}
        <CardTotalRevenueOverview />

        {/* Total Products Sold Card */}
        <CardTotalProductsSold />

        {/* Stock Status Card */}
        <CardStockStatus />

        {/* New Product Additions Card */}
        <CardNewProductAdditions />

        {/* Outlet Performance Card */}
        <CardOutletPerformance />

        {/* Stat Cards */}
        <StatCard
          title="Customer & Revenue"
          primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2023"
          details={[
            {
              title: "Revenue",
              amount: "$1,200.00",
              changePercentage: 12,
              IconComponent: TrendingUp,
            },
            {
              title: "Expenses",
              amount: "$200.00",
              changePercentage: -5,
              IconComponent: TrendingDown,
            },
          ]}
        />

        <StatCard
          title="Sales & Stock"
          primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
          dateRange="22 - 29 October 2023"
          details={[
            {
              title: "Products Sold",
              amount: "500",
              changePercentage: 15,
              IconComponent: TrendingUp,
            },
            {
              title: "Stock Remaining",
              amount: "2,000",
              changePercentage: -8,
              IconComponent: TrendingDown,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
