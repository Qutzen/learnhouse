import { getCourses } from "@/app/data/admin/get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import { CourseCard, CourseCardSkeleton } from "./_components/CourseCard";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { EmptyState } from "@/components/general/EmptyState";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Your Courses</h1>
        <Link
          className={buttonVariants({
            className: "h-10 rounded-md",
          })}
          href="/admin/courses/create"
        >
          Create Courses
          <IconSquareRoundedPlus className="size-4 ml-1" />
        </Link>
      </div>
      <Suspense fallback={<CourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const data = await getCourses();
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Courses Yet"
          description="Create your first course to begin building your curriculum. Add
        chapters, lessons, videos, and assignments for your learners."
          btnText="Create Your First Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
          {data.map((course) => (
            <CourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function CourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
      {Array.from({ length: 6 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
