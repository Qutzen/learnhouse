"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopCourse {
  title: string;
  enrollments: number;
}

interface Props {
  data: TopCourse[];
}

const COLORS = [
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
];

export function TopPerformingCoursesChart({ data }: Props) {
  return (
    <Card className="bg-linear-to-t from-primary/5 to-card shadow-xs">
      <CardHeader>
        <CardTitle>Top Performing Courses </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="relative h-80  w-full lg:w-[65%]">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient
                    id="gradient-purple"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>

                  <linearGradient
                    id="gradient-cyan"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>

                  <linearGradient
                    id="gradient-green"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>

                  <linearGradient
                    id="gradient-amber"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>

                  <linearGradient
                    id="gradient-pink"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>

                <Pie
                  data={data}
                  dataKey="enrollments"
                  nameKey="title"
                  cx="52%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  cornerRadius={6}
                  label={({ percent }) => {
                    if (!percent || percent < 0.05) return "";
                    return `${(percent * 100).toFixed(0)}%`;
                  }}
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        [
                          "url(#gradient-purple)",
                          "url(#gradient-cyan)",
                          "url(#gradient-green)",
                          "url(#gradient-amber)",
                          "url(#gradient-pink)",
                        ][index % 5]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [`${value} Enrollments`, "Students"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 items-start lg:w-55">
            {data.map((course, index) => (
              <div
                key={course.title}
                className="
        flex items-center gap-3
        px-3 py-2
      "
              >
                <div
                  className="h-3.5 w-3.5 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />

                <span className="truncate text-sm font-medium">
                  {course.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
