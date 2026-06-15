"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import useCourseProgress from "@/hooks/use-course-progress";

interface iAppProps {
  course: CourseSidebarDataType["course"];
}

export function CourseSidebar({ course }: iAppProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();

  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress({ courseData: course });

  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {course.category}
            </p>
          </div>
        </div>
        <div className="space-y-2 mb-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>

          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground uppercase">
            {progressPercentage}% Completed
          </p>
        </div>
        <div className="space-y-3">
          {course.chapter.map((chapter, index) => (
            <Card key={chapter.id} className="overflow-hidden rounded-lg px-2">
              <Collapsible defaultOpen={index === 0}>
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <div className="flex min-w-0 text gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {chapter.position} : {chapter.title}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-[10px] font-medium truncate text-muted-foreground sm:block">
                      {chapter.lessons.length} Lessons
                    </span>
                    <CollapsibleTrigger className="rounded-md p-1 hover:bg-accent">
                      <ChevronDown className="size-4" />
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent className="mt-3 pl-6 space-y-3">
                  {chapter.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      slug={course.slug}
                      isActive={currentLessonId === lesson.id}
                      completed={
                        lesson.lessonProgress.find(
                          (progress) => progress.lessonId === lesson.id,
                        )?.completed || false
                      }
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
