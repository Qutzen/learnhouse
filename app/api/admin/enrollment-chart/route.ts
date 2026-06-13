import { getEnrollmentChartData } from "@/app/data/admin/get-enrollment-chart-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const range =
    (req.nextUrl.searchParams.get("range") as "7d" | "30d" | "90d") || "90d";

  const data = await getEnrollmentChartData(range);

  return NextResponse.json(data);
}
