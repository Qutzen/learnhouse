"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  courseCategories,
  courseLevels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchemas";
import { Loader2, Zap } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import RichTextEditor from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { EditCourse } from "../edit/actions";
import { CourseType } from "@/app/data/admin/get-course";

interface iAppProps {
  data: CourseType;
}

export function EditCourseForm({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<
    z.input<typeof courseSchema>,
    undefined,
    z.output<typeof courseSchema>
  >({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      fileKey: data.fileKey,
      price: data.price,
      duration: data.duration,
      level: data.level,
      category: data.category as CourseSchemaType["category"],
      status: data.status,
      slug: data.slug,
      smallDescription: data.smallDescription,
    },
  });

  function onSubmit(values: CourseSchemaType) {
    // console.log(values);
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        EditCourse(values, data.id),
      );

      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr] gap-4 items-start">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
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
            <div className="flex gap-2 items-end">
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input
                      {...field}
                      id="slug"
                      aria-invalid={fieldState.invalid}
                      placeholder="Slug"
                      autoComplete="off"
                      className="h-10 rounded-md"
                    />
                    {fieldState.invalid && (
                      <FieldError
                        className="whitespace-nowrap"
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
              <Button
                type="button"
                className="w-fit h-10 rounded-md"
                onClick={() => {
                  const titleValue = form.getValues("title");
                  const slug = slugify(titleValue);

                  form.setValue("slug", slug, { shouldValidate: true });
                }}
              >
                Generate
                <Zap className="ml-1" size={16} />
              </Button>
            </div>
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category">Category</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={fieldState.invalid}
                      className="w-full h-10! rounded-md"
                    >
                      <SelectValue
                        placeholder="Select Category"
                        className="h-10"
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {courseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="level"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="level">Level</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="level"
                      aria-invalid={fieldState.invalid}
                      className="w-full h-10! rounded-md"
                    >
                      <SelectValue
                        placeholder="Select Level"
                        className="h-10"
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {courseLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="duration">Duration [Hours]</FieldLabel>
                  <Input
                    {...field}
                    value={(field.value as number | undefined) ?? ""}
                    id="duration"
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    autoComplete="off"
                    className="h-10 rounded-md"
                    type="number"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="price">Price [₹]</FieldLabel>
                  <Input
                    {...field}
                    value={(field.value as number | undefined) ?? ""}
                    id="price"
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    autoComplete="off"
                    className="h-10 rounded-md"
                    type="number"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">Status</FieldLabel>

                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="status"
                      aria-invalid={fieldState.invalid}
                      className="w-full h-10! rounded-md"
                    >
                      <SelectValue
                        placeholder="Select Status"
                        className="h-10"
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {courseStatus.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 items-start">
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <RichTextEditor field={field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="fileKey"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fileKey">Thumbnail Image</FieldLabel>
                  <Uploader
                    onChange={field.onChange}
                    value={field.value}
                    fileTypeAccepted="image"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_2fr] gap-4">
            <Controller
              name="smallDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="smallDescription">
                    Small Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      value={(field.value as string) ?? ""}
                      id="smallDescription"
                      rows={8}
                      className="min-h-28 resize-none"
                      placeholder="Short description..."
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText>
                        {field.value?.length ?? 0}/200
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
        <Button type="submit" disabled={pending} className="h-10 rounded-md">
          {pending ? (
            <>
              Updating... <Loader2 className="animate-spin ml-1" />
            </>
          ) : (
            <>
              Update Course{" "}
              <IconSquareRoundedPlus className="ml-1" size={16} />{" "}
            </>
          )}
        </Button>
      </form>
    </>
  );
}
