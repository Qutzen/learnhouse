import { getAnalyticsData } from "@/app/data/admin/get-analytics";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export async function AnalyticsCards() {
  const {
    enrollmentGrowth,
    revenueGrowth,
    averageEnrollments,
    revenuePerCourse,
  } = await getAnalyticsData();

  const enrollmentPositive = Number(enrollmentGrowth) >= 0;
  const revenuePositive = Number(revenueGrowth) >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 uppercase">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Enrollment Growth</CardDescription>

          <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {enrollmentPositive ? (
              <TrendingUp className="size-5 text-emerald-500" />
            ) : (
              <TrendingDown className="size-5 text-red-500" />
            )}
            {enrollmentPositive ? "+" : ""}
            {enrollmentGrowth}%
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compared To Last Month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue Growth</CardDescription>

          <CardTitle className="flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {revenuePositive ? (
              <TrendingUp className="size-5 text-emerald-500" />
            ) : (
              <TrendingDown className="size-5 text-red-500" />
            )}
            {revenuePositive ? "+" : ""}
            {revenueGrowth}%
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compared To Last Month
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg Enrollments / Course</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {averageEnrollments}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Students Per Course
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue / Course</CardDescription>

          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₹{revenuePerCourse.toLocaleString("en-IN")}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Average Earnings
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
