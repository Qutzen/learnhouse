import "dotenv/config";
import { randomUUID } from "crypto";
import { prisma } from "../lib/db";
import { CourseLevel } from "../lib/generated/prisma/client";

async function main() {
  console.log("Starting seed...");

  // Clean old data
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany({
    where: {
      role: "user",
    },
  });

  console.log("Creating users...");

  const users = [];

  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: `Student ${i}`,
        email: `student${i}@test.com`,
        emailVerified: true,
        role: "user",
      },
    });

    users.push(user);
  }

  console.log("Creating courses...");

  const instructor = users[0];

  const courses = [];

  const levels = [
    CourseLevel.Beginner,
    CourseLevel.Intermediate,
    CourseLevel.Advanced,
  ];

  for (let i = 1; i <= 10; i++) {
    const course = await prisma.course.create({
      data: {
        title: `Course ${i}`,
        description: `Demo course description for Course ${i}`,
        smallDescription: `Learn Course ${i}`,
        fileKey: "demo-image",
        category: "Programming",
        slug: `course-${i}`,
        price: [499, 999, 1499, 1999][Math.floor(Math.random() * 4)],
        duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        level: levels[Math.floor(Math.random() * levels.length)],
        status: "Published",
        userId: instructor.id,
      },
    });

    courses.push(course);
  }

  console.log("Creating enrollments...");

  const usedPairs = new Set<string>();

  for (let day = 0; day < 90; day++) {
    const enrollmentsPerDay = Math.floor(Math.random() * 10) + 5; // 5-15/day

    for (let i = 0; i < enrollmentsPerDay; i++) {
      const user = users[Math.floor(Math.random() * users.length)];

      const course = courses[Math.floor(Math.random() * courses.length)];

      const key = `${user.id}-${course.id}`;

      if (usedPairs.has(key)) continue;

      usedPairs.add(key);

      await prisma.enrollment.create({
        data: {
          amount: course.price,
          status: "Active",
          userId: user.id,
          courseId: course.id,
          createdAt: new Date(Date.now() - day * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  const totalUsers = await prisma.user.count();
  const totalCourses = await prisma.course.count();
  const totalEnrollments = await prisma.enrollment.count();

  console.log("Seed completed");
  console.log({
    totalUsers,
    totalCourses,
    totalEnrollments,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
