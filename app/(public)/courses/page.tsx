import Image from "next/image";
import Learn from "@/public/learn.jpg";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/PublicCourseCard";
import { Suspense } from "react";

export default function PublicCourses() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-8 md:p-12 lg:px-16 lg:py-24">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl font-black md:text-6xl">
                Explore <span className="text-[#FF9D23]">Course</span>
              </h2>
              <p className="hidden sm:mt-4 sm:block text-xl font-medium">
                Discover our wide range of courses designed to help you achieve
                your Learning goals
              </p>
              <div className="mt-4 md:mt-8">
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                    className: "h-10 rounded-md font-black",
                  })}
                  href="#"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
            <div className="relative h-40 sm:h-56 md:h-full min-h-62.5">
              <Image
                src={Learn}
                alt="Learning"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="relative h-40 sm:h-56 md:h-full min-h-62.5">
              <Image src={Learn} alt="Learning" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-5xl my-8 font-black">
          Our Popular <span className="text-[#FF9D23]">Courses</span>
        </h1>
      </div>
      <Suspense fallback={<LoadingSkeletonLayout></LoadingSkeletonLayout>}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const courses = await getAllCourses();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
