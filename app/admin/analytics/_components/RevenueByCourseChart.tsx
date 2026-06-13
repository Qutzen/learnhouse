"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueCourse {
  course: string;
  revenue: number;
}

interface Props {
  data: RevenueCourse[];
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
};

export function RevenueByCourseChart({ data }: Props) {
  const totalRevenue = data.reduce((sum, course) => sum + course.revenue, 0);

  return (
    <Card className="bg-linear-to-t from-primary/5 to-card shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Revenue By Course</span>

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
        <div className="h-80 w-full min-w-0">
          <ResponsiveContainer width="99%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>

                <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>

                <linearGradient id="barGradient4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>

                <linearGradient id="barGradient5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="course"
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
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
                }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Revenue",
                ]}
              />

              <Bar dataKey="revenue" radius={[5, 5, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      [
                        "url(#barGradient1)",
                        "url(#barGradient2)",
                        "url(#barGradient3)",
                        "url(#barGradient4)",
                        "url(#barGradient5)",
                      ][index % 5]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
