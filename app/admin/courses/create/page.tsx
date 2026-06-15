"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Link from "next/link";
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
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconArrowBadgeLeft, IconSquareRoundedPlus } from "@tabler/icons-react";
import { useConfetti } from "@/hooks/use-confetti";

export default function CourseCreationPage() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerConfetti } = useConfetti();

  const form = useForm<
    z.input<typeof courseSchema>,
    undefined,
    z.output<typeof courseSchema>
  >({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "IT & Software",
      status: "Draft",
      slug: "",
      smallDescription: "",
    },
  });

  function onSubmit(values: CourseSchemaType) {
    // console.log(values);
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateCourse(values));

      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            className: "h-10 w-28 rounded-md",
            size: "icon",
            variant: "outline",
          })}
        >
          <IconArrowBadgeLeft className="size-5" />
          Go Back
        </Link>
        <h1 className="text-2xl font-black">Create Courses</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide Basic Information about the Course
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <FieldLabel htmlFor="duration">
                        Duration [Hours]
                      </FieldLabel>
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
                  render={({ field, fieldState }) => {
                    // console.log("thumbnail value:", field.value);
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
            <Button
              type="submit"
              disabled={pending}
              className="h-10 rounded-md"
            >
              {pending ? (
                <>
                  Creating... <Loader2 className="animate-spin ml-1" />
                </>
              ) : (
                <>
                  Create Course{" "}
                  <IconSquareRoundedPlus className="ml-1" size={16} />{" "}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
