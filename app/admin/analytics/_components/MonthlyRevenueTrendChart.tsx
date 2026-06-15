"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueData {
  month: string;
  revenue: number;
}

interface Props {
  data: RevenueData[];
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
};

export function MonthlyRevenueTrendChart({ data }: Props) {
  // console.log("Monthly Revenue Data:", data);

  if (!data || data.length === 0) {
    return (
      <Card className="bg-linear-to-t from-primary/5 to-card shadow-xs">
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex h-80 items-center justify-center text-muted-foreground">
            No revenue data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card className="bg-linear-to-t from-primary/5 to-card shadow-xs min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Monthly Revenue Trend</span>

          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>

            <span className="text-muted-foreground text-xs font-normal">
              Total Revenue
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="relative h-80 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.2}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />

              <YAxis
                tickFormatter={formatCurrency}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "#ffffff",
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Revenue",
                ]}
              />

              <Area
                type="natural"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#fillRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
