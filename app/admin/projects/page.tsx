import { getAdminCourses } from "@/app/data/admin/get-courses";
import { CourseDataTable } from "./_components/CourseDataTable";
import { columns } from "./_components/columns";

export default async function CoursesPage() {
  const data = await getAdminCourses();

  return <CourseDataTable columns={columns} data={data} />;
}
