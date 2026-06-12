"use client";
import { CoursesType } from "@/app/data/admin/get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct";
import { IconTimeline } from "@tabler/icons-react";
import { MoreVertical, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: CoursesType;
}

export function CourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  console.log(thumbnailUrl);

  return (
    <>
      <Card className="group relative overflow-hidden rounded-md py-0 gap-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="size-8 backdrop-blur-sm bg-transparent"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-24 uppercase font-medium"
            >
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${data.id}/edit`}>Edit Course</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/courses/${data.slug}`}>Preview</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-destructive">
                <Link href={`/admin/courses/${data.id}/delete`}>
                  Delete Course
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={thumbnailUrl ?? "/placeholder.jpg"}
            alt={data.title}
            fill
            unoptimized
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white transition-all duration-500 group-hover:-translate-y-1">
            <Link
              href={`/admin/courses/${data.id}/edit`}
              className="line-clamp-2 text-xl font-bold hover:underline"
            >
              {data.title}
            </Link>
            <p className="mt-2 line-clamp-2 text-sm text-white/80">
              {data.smallDescription}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-white/90">
              <div className="flex items-center gap-1">
                <TimerIcon className="size-4" />
                <span>{data.duration}h</span>
              </div>
              <div className="flex items-center gap-1">
                <IconTimeline className="size-4" />
                <span>{data.level}</span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Course Status</p>
              <p className="font-medium">{data.status}</p>
            </div>
            <Link
              href={`/admin/courses/${data.id}/edit`}
              className={buttonVariants({
                size: "lg",
                className: "rounded-md",
              })}
            >
              Edit Course
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-md py-0 gap-0">
      <div className="relative h-48">
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="absolute right-3 top-3 h-8 w-8 rounded-md" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Skeleton className="h-6 w-3/4 bg-white/20" />
          <Skeleton className="mt-2 h-4 w-full bg-white/20" />
          <Skeleton className="mt-1 h-4 w-2/3 bg-white/20" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-4 w-16 bg-white/20" />
            <Skeleton className="h-4 w-20 bg-white/20" />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
