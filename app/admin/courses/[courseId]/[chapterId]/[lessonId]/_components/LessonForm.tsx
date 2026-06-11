"use client";

import { LessonType } from "@/app/data/admin/get-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { Controller, useForm } from "react-hook-form";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowBadgeLeft } from "@tabler/icons-react";
import Link from "next/link";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { updateLesson } from "../actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface iAppProps {
  data: LessonType;
  chapterId: string;
  courseId: string;
}

export function LessonForm({ chapterId, data, courseId }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId: chapterId,
      courseId: courseId,
      description: data.description ?? "",
      videoKey: data.videoKey ?? "",
      thumbnailKey: data.thumbnailKey ?? "",
    },
  });

  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson(values, data.id),
      );

      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push(`/admin/courses/${courseId}/edit`);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div>
      <Link
        className={buttonVariants({
          variant: "outline",
          className: "mb-6 h-10",
        })}
        href={`/admin/courses/${courseId}/edit`}
      >
        <IconArrowBadgeLeft className="size-5" />
        <span>Go Back</span>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the vedio and description for this lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-4 items-start">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">Lesson Name</FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Title"
                        autoComplete="off"
                        className="h-10 rounded-md"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <RichTextEditor
                      field={{
                        ...field,
                        value: field.value ?? "",
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-4 items-start">
                <Controller
                  name="thumbnailKey"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="fileKey">
                          Thumbnail Image
                        </FieldLabel>
                        <Uploader
                          onChange={field.onChange}
                          value={field.value}
                          fileTypeAccepted="image"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
                <Controller
                  name="videoKey"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="videoKey">Video File</FieldLabel>
                        <Uploader
                          onChange={field.onChange}
                          value={field.value}
                          fileTypeAccepted="video"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </FieldGroup>
            <Button
              type="submit"
              className="h-10 rounded-md"
              disabled={pending}
            >
              {pending ? "Saving..." : "Save Lesson"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
