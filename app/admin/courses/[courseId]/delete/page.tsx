"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCourse } from "./action";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

export default function DeletePage() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const { courseId } = useParams<{ courseId: string }>();
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course</CardTitle>
          <CardDescription>This action cannot be undone</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-5">
          <Button
            variant="destructive"
            className="h-10 rounded-md"
            onClick={onSubmit}
            disabled={pending}
          >
            {pending ? "Deleting..." : "Delete"}
          </Button>
          <Link
            href="/admin/courses"
            className={buttonVariants({
              variant: "outline",
              className: "h-10 rounded-md",
            })}
          >
            Cancel
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
