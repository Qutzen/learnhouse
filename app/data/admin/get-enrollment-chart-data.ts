import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

type TimeRange = "90d" | "30d" | "7d";

export async function getEnrollmentChartData(range: TimeRange = "90d") {
  await requireAdmin();

  const daysMap = {
    "90d": 90,
    "30d": 30,
    "7d": 7,
  };

  const days = daysMap[range];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      status: "Active",
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const groupedData = enrollments.reduce(
    (acc, enrollment) => {
      const date = enrollment.createdAt.toISOString().split("T")[0];

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(groupedData).map(([date, enrollments]) => ({
    date,
    enrollments,
  }));
}
