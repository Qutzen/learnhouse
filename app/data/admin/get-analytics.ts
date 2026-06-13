import { prisma } from "@/lib/db";

export async function getTopPerformingCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          enrollment: {
            where: {
              status: "Active",
            },
          },
        },
      },
    },
    orderBy: {
      enrollment: {
        _count: "desc",
      },
    },
    take: 5,
  });

  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    enrollments: course._count.enrollment,
  }));
}

export async function getRevenueByCourse() {
  const courses = await prisma.course.findMany({
    select: {
      title: true,
      enrollment: {
        where: {
          status: "Active",
        },
        select: {
          amount: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    course: course.title,
    revenue: course.enrollment.reduce((sum, item) => sum + item.amount, 0),
  }));
}

export async function getCourseStatusStats() {
  const [published, draft, archived] = await Promise.all([
    prisma.course.count({
      where: {
        status: "Published",
      },
    }),

    prisma.course.count({
      where: {
        status: "Draft",
      },
    }),

    prisma.course.count({
      where: {
        status: "Archived",
      },
    }),
  ]);

  return [
    {
      name: "Published",
      value: published,
    },
    {
      name: "Draft",
      value: draft,
    },
    {
      name: "Archived",
      value: archived,
    },
  ];
}

export async function getEnrollmentGrowth() {
  const now = new Date();

  const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const current = await prisma.enrollment.count({
    where: {
      createdAt: {
        gte: startCurrentMonth,
      },
    },
  });

  const previous = await prisma.enrollment.count({
    where: {
      createdAt: {
        gte: startPrevMonth,
        lte: endPrevMonth,
      },
    },
  });

  const growth = previous === 0 ? 100 : ((current - previous) / previous) * 100;

  return growth.toFixed(1);
}

export async function getRevenueGrowth() {
  const now = new Date();

  const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const current = await prisma.enrollment.aggregate({
    where: {
      createdAt: {
        gte: startCurrentMonth,
      },
      status: "Active",
    },
    _sum: {
      amount: true,
    },
  });

  const previous = await prisma.enrollment.aggregate({
    where: {
      createdAt: {
        gte: startPrevMonth,
        lte: endPrevMonth,
      },
      status: "Active",
    },
    _sum: {
      amount: true,
    },
  });

  const currentRevenue = current._sum.amount ?? 0;
  const previousRevenue = previous._sum.amount ?? 0;

  const growth =
    previousRevenue === 0
      ? 100
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  return growth.toFixed(1);
}

export async function getTopSellingCourses() {
  const courses = await prisma.course.findMany({
    select: {
      title: true,
      enrollment: {
        where: {
          status: "Active",
        },
        select: {
          amount: true,
        },
      },
    },
  });

  return courses
    .map((course) => ({
      title: course.title,
      revenue: course.enrollment.reduce((sum, item) => sum + item.amount, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export async function getMonthlyRevenueTrend() {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      status: "Active",
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const monthlyRevenue = new Map();

  enrollments.forEach((item) => {
    const month = item.createdAt.toLocaleString("en-US", {
      month: "short",
    });

    monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + item.amount);
  });

  return Array.from(monthlyRevenue.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export async function getAverageEnrollmentsPerCourse() {
  const totalCourses = await prisma.course.count();

  const totalEnrollments = await prisma.enrollment.count({
    where: {
      status: "Active",
    },
  });

  return totalCourses > 0 ? (totalEnrollments / totalCourses).toFixed(1) : "0";
}
export async function getRevenuePerCourse() {
  const totalCourses = await prisma.course.count();

  const revenue = await prisma.enrollment.aggregate({
    where: {
      status: "Active",
    },
    _sum: {
      amount: true,
    },
  });

  const totalRevenue = revenue._sum.amount ?? 0;

  return totalCourses > 0 ? Math.round(totalRevenue / totalCourses) : 0;
}

export async function getAnalyticsData() {
  const [
    topCourses,
    revenueByCourse,
    courseStatus,
    enrollmentGrowth,
    revenueGrowth,
    topSellingCourses,
    monthlyRevenue,
    averageEnrollments,
    revenuePerCourse,
  ] = await Promise.all([
    getTopPerformingCourses(),
    getRevenueByCourse(),
    getCourseStatusStats(),
    getEnrollmentGrowth(),
    getRevenueGrowth(),
    getTopSellingCourses(),
    getMonthlyRevenueTrend(),
    getAverageEnrollmentsPerCourse(),
    getRevenuePerCourse(),
  ]);

  return {
    topCourses,
    revenueByCourse,
    courseStatus,
    enrollmentGrowth,
    revenueGrowth,
    topSellingCourses,
    monthlyRevenue,
    averageEnrollments,
    revenuePerCourse,
  };
}
