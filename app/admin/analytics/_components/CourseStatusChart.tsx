"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseStatus {
  name: string;
  value: number;
}

interface Props {
  data: CourseStatus[];
}

const COLORS = [
  "#10b981", // Published - Green
  "#f59e0b", // Draft - Amber
  "#ef4444", // Archived - Red
];

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
};

const renderCustomizedLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  percent = 0,
}: PieLabelProps) => {
  if (percent < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#6b7280"
      fontSize={14}
      fontWeight={500}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

export function CourseStatusChart({ data }: Props) {
  return (
    <Card className="bg-linear-to-t from-primary/5 to-card shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Course Status</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="relative h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="52%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  cornerRadius={6}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
                  }}
                  itemStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value) => [`${value} Courses`, "Count"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center gap-4 lg:w-45">
            {data.map((item, index) => (
              <div
                key={item.name}
                className="
                  flex items-center gap-3
                "
              >
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
