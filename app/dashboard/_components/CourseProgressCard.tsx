/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-course";
import useCourseProgress from "../../../hooks/use-course-progress";
import { Progress } from "@/components/ui/progress";

interface iAppProps {
  data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.course.fileKey);
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: data.course as any });

  return (
    <Card className="group overflow-hidden rounded-xl border py-0 gap-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={thumbnailUrl ?? "/placeholder.jpg"}
          alt={data.course.title}
          fill
          priority
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white transition-all duration-500 group-hover:-translate-y-1">
          <Link
            href={`/dashboard/${data.course.slug}`}
            className="line-clamp-2 text-xl font-bold"
          >
            {data.course.title}
          </Link>

          <p className="mt-2 line-clamp-2 text-sm text-white/80">
            {data.course.smallDescription}
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress: </p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        <div className="my-4 border-t" />
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Course Level</p>
            <p className="font-semibold">{data.course.level}</p>
          </div>
          <Link
            href={`/dashboard/${data.course.slug}`}
            className={buttonVariants({
              size: "lg",
              className: "rounded-md",
            })}
          >
            Learn More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border py-0 gap-0">
      <div className="relative h-48 overflow-hidden">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Skeleton className="h-7 w-3/4 bg-white/20" />
          <Skeleton className="mt-3 h-4 w-full bg-white/20" />
          <Skeleton className="mt-2 h-4 w-5/6 bg-white/20" />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="my-4 border-t" />
        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-5 w-24" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
