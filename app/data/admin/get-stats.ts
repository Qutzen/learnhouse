import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getStats() {
  await requireAdmin();

  const [totalSignups, totalCustomers, totalCourses, totalRevenue] =
    await Promise.all([
      // Total Signups
      prisma.user.count(),

      // Total Customers
      prisma.enrollment.count({
        where: {
          status: "Active",
        },
      }),

      // Total Courses
      prisma.course.count(),

      // Total Revenue
      prisma.enrollment.aggregate({
        where: {
          status: "Active",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

  return {
    totalSignups,
    totalCustomers,
    totalCourses,
    totalRevenue: totalRevenue._sum.amount ?? 0,
  };
}
