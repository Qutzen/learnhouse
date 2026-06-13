import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { getRecentCourses } from "../data/admin/get-recent-course";
import { EmptyState } from "@/components/general/EmptyState";
import {
  CourseCard,
  CourseCardSkeleton,
} from "./courses/_components/CourseCard";
import { Suspense } from "react";

export default function AdminIndexPage() {
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "h-10 rounded-md",
            })}
            href="/admin/course"
          >
            View All Courses
          </Link>
        </div>
        <Suspense fallback={<RenderRecentCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourses() {
  const data = await getRecentCourses();

  if (data.length === 0) {
    <EmptyState
      title="No Courses Yet"
      description="Create your first course to begin building your curriculum. Add
            chapters, lessons, videos, and assignments for your learners."
      btnText="Create Your First Course"
      href="/admin/courses/create"
    />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
      {data.map((course) => (
        <CourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function RenderRecentCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
      {Array.from({ length: 3 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
