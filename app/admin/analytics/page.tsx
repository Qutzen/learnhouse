import { getAnalyticsData } from "@/app/data/admin/get-analytics";
import { TopPerformingCoursesChart } from "./_components/TopPerformingCoursesChart";
import { RevenueByCourseChart } from "./_components/RevenueByCourseChart";
import { CourseStatusChart } from "./_components/CourseStatusChart";
import { MonthlyRevenueTrendChart } from "./_components/MonthlyRevenueTrendChart";
import { AnalyticsCards } from "./_components/AnalyticsCards";
import { TopSellingCoursesTable } from "./_components/TopSellingCoursesTable";

export default async function CoursesPage() {
  const data = await getAnalyticsData();
  return (
    <div className="space-y-6">
      <AnalyticsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <TopPerformingCoursesChart data={data.topCourses} />
        <RevenueByCourseChart data={data.revenueByCourse} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CourseStatusChart data={data.courseStatus} />
        <MonthlyRevenueTrendChart data={data.monthlyRevenue} />
      </div>
      <TopSellingCoursesTable data={data.topSellingCourses} />
    </div>
  );
}
