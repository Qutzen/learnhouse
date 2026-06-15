import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getCourses() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await requireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      category: true,
    },
  });

  return data;
}

export async function getAdminCourses() {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      price: true,
      level: true,
      status: true,
      fileKey: true,
      createdAt: true,

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
  });

  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.smallDescription,
    image: course.fileKey,
    price: course.price,
    level: course.level,
    status: course.status,
    students: course._count.enrollment,
    createdAt: course.createdAt.toLocaleDateString("en-IN"),
  }));
}

export type CoursesType = Awaited<ReturnType<typeof getCourses>>[0];

export type AdminCoursesType = Awaited<ReturnType<typeof getAdminCourses>>[0];
