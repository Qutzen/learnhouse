import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct";
import { IconTimeline } from "@tabler/icons-react";
import { TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group overflow-hidden rounded-xl border py-0 gap-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={thumbnailUrl ?? "/placeholder.jpg"}
          alt={data.title}
          fill
          priority
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white transition-all duration-500 group-hover:-translate-y-1">
          <Link
            href={`/courses/${data.slug}`}
            className="line-clamp-2 text-xl font-bold"
          >
            {data.title}
          </Link>

          <p className="mt-2 line-clamp-2 text-sm text-white/80">
            {data.smallDescription}
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TimerIcon className="size-4 shrink-0" />
            <span>{data.duration} hours</span>
          </div>
          <div className="flex items-center gap-2">
            <IconTimeline className="size-4 shrink-0" />
            <span>{data.level} Level</span>
          </div>
        </div>
        <div className="my-4 border-t" />
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Course Level</p>
            <p className="font-semibold">{data.level}</p>
          </div>
          <Link
            href={`/courses/${data.slug}`}
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
