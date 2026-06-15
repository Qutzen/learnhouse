import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-course";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>

        <p className="text-muted-foreground mb-2">
          Here you can see all the courses you have access to
        </p>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No courses purchased"
            description="You haven't purchased any courses yet."
            btnText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
            {enrolledCourses.map((course) => (
              <CourseProgressCard key={course.course.id} data={course} />
            ))}
          </div>
        )}

        <section className="mt-10">
          <div className="flex flex-col gap-2 mb-5">
            <h1 className="text-3xl font-bold">Available Courses</h1>

            <p className="text-muted-foreground">
              Here you can see all the courses you can purchase
            </p>
          </div>
          {courses.filter(
            (course) =>
              !enrolledCourses.some(
                ({ course: enrolled }) => enrolled.id === course.id,
              ),
          ).length === 0 ? (
            <EmptyState
              title="No courses available"
              description="You have already purchased all available courses."
              btnText="Browse Courses"
              href="/courses"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-7">
              {courses
                .filter(
                  (course) =>
                    !enrolledCourses.some(
                      ({ course: enrolled }) => enrolled.id === course.id,
                    ),
                )
                .map((course) => (
                  <PublicCourseCard key={course.id} data={course} />
                ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
