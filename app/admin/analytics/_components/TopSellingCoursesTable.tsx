import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopSellingCourse {
  title: string;
  revenue: number;
}

interface Props {
  data: TopSellingCourse[];
}

export function TopSellingCoursesTable({ data }: Props) {
  return (
    <Card className="bg-linear-to-t from-primary/5 to-card shadow-xs">
      <CardHeader>
        <CardTitle>Top Selling Courses</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No course sales found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((course, index) => (
                  <TableRow key={course.title}>
                    <TableCell className="font-semibold">
                      #{index + 1}
                    </TableCell>

                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>

                    <TableCell className="text-right font-semibold">
                      ₹{course.revenue.toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
