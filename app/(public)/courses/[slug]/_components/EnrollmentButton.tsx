"use client";

import { Button } from "@base-ui/react";
import { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourseAction } from "../action";
import { tryCatch } from "@/hooks/try-catch";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId),
      );
      console.log("RESULT:", result);
      console.log("ERROR:", error);
      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        if (result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
          return;
        }

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }
  return (
    <Button
      onClick={onSubmit}
      disabled={pending}
      className="mt-6 h-11 w-full rounded-md text-base font-semibold bg-black text-white cursor-pointer"
    >
      {pending ? <>Loading...</> : "Enroll Now!"}
    </Button>
  );
}
