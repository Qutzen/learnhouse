import { getIndividualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { env } from "@/lib/env";
import {
  IconCategory2,
  IconChartLine,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { checkIfCourseBougth } from "@/app/data/user/user-is-enrolled";
import Link from "next/link";
import { EnrollmentButton } from "./_components/EnrollmentButton";
import { Button } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  const thumbnailUrl = constructUrl(course.fileKey);
  const isEnrolled = await checkIfCourseBougth(course.id);
  return (
    <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailUrl ?? "/placeholder.jpg"}
            alt={course.title}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
        </div>
        <div className="mt-6 space-y-6 sm:mt-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
              {course.smallDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground sm:gap-6 sm:text-base">
            <div className="flex items-center gap-2">
              <IconCategory2 className="size-5 shrink-0" />
              <span>{course.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <IconChartLine className="size-5 shrink-0" />
              <span>{course.level} Level</span>
            </div>

            <div className="flex items-center gap-2">
              <IconClock className="size-5 shrink-0" />
              <span>{course.duration} Hours</span>
            </div>
          </div>

          <Separator />

          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Course Description
            </h2>

            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-10 space-y-4 sm:mt-12 sm:space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Course Content
            </h2>

            <div className="text-sm text-muted-foreground sm:text-base">
              {course.chapter.length} Chapters |{" "}
              {course.chapter.reduce(
                (total, chapter) => total + chapter.lessons.length,
                0,
              )}{" "}
              Lessons
            </div>
          </div>

          <div className="space-y-4">
            {course.chapter.map((chapter, index) => (
              <Card key={chapter.id} className="rounded-xl">
                <Collapsible defaultOpen={index === 0}>
                  <div className="flex items-center justify-between border-b border-border p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Badge
                        variant="outline"
                        className="flex size-8 shrink-0 items-center justify-center rounded-md font-semibold"
                      >
                        {index + 1}
                      </Badge>

                      <p className="truncate text-sm font-medium uppercase sm:text-base lg:text-lg">
                        {chapter.title}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs font-medium uppercase text-muted-foreground sm:text-sm">
                        {chapter.lessons.length} Lessons
                      </span>

                      <CollapsibleTrigger className="rounded-md p-1 hover:bg-accent">
                        <ChevronDown className="size-4" />
                      </CollapsibleTrigger>
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="p-1">
                      {chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 rounded-md p-4 transition-colors hover:bg-accent"
                        >
                          <Badge
                            variant="outline"
                            className="flex size-8 items-center justify-center rounded-md"
                          >
                            <IconPlayerPlay className="size-4" />
                          </Badge>

                          <p className="text-sm sm:text-base">{lesson.title}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="order-2 lg:col-span-1">
        <div className="lg:sticky lg:top-20">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-5 sm:p-6">
              <h3 className="text-lg font-bold sm:text-xl">Price</h3>

              <div className="mt-2 flex flex-wrap items-end gap-2">
                <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(course.price)}
                </span>

                <span className="text-sm text-muted-foreground">
                  / Lifetime Access
                </span>
              </div>

              <p className="mt-3 text-lg font-bold">Course Overview</p>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h5 className="text-sm font-semibold sm:text-base">
                    Course Duration
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {course.duration} Hours
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold sm:text-base">
                    Difficulty Level
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {course.level}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold sm:text-base">
                    Category
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {course.category}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold sm:text-base">
                    Total Lessons
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {course.chapter.length} Chapters |{" "}
                    {course.chapter.reduce(
                      (total, chapter) => total + chapter.lessons.length,
                      0,
                    )}{" "}
                    Lessons
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-lg font-bold sm:text-xl">
                  Whats Included
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      title: "Lifetime Access",
                      desc: "Access course content anytime with future updates.",
                    },
                    {
                      title: "Mobile & Desktop Access",
                      desc: "Learn seamlessly across devices.",
                    },
                    {
                      title: "Certificate of Completion",
                      desc: "Earn a certificate after finishing the course.",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg"
                    >
                      <Badge
                        variant="outline"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      >
                        {index + 1}
                      </Badge>

                      <div>
                        <h4 className="text-sm font-semibold sm:text-base">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {isEnrolled ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-md mt-6 w-full text-base font-semibold"
                >
                  <Link href="/dashboard">Watch Course</Link>
                </Button>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const constructUrl = (key?: string | null) => {
  if (!key?.trim()) return undefined;

  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${key}`;
};
