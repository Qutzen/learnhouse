import React from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);
  return (
    <div className="flex flex-1">
      <div className="w-90 border-r border-b shrink-0">
        <CourseSidebar course={course.course} />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
