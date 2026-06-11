import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be atleast 3 Characters Long" })
    .max(100, { message: "Title must be at most 100 Characters Long" }),

  description: z
    .string()
    .min(3, { message: "Description must be atleast 3 Characters Long" }),

  fileKey: z.string().min(1, { message: "File is required" }),

  price: z.coerce
    .number()
    .min(1, { message: "Price must be a Positive number" }),

  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be atleast 1 hour" })
    .max(500, { message: "Duration must be at most 100 hours" }),

  level: z.enum(courseLevels, { message: "Level is required" }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be atleast 3 Characters Long" })
    .max(200, {
      message: "Small Description must be at most 200 Characters Long",
    }),

  slug: z
    .string()
    .min(3, { message: "Slug must be atleast 3 Characters Long" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 Characters Long" }),
  courseId: z.string().uuid({ message: "Invalid Course Id" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be atleast 3 Characters Long" }),
  courseId: z.string().uuid({ message: "Invalid Course Id" }),
  chapterId: z.string().uuid({ message: "Invalid Chapter Id" }),
  description: z
    .string()
    .min(3, { message: "Description must be atleast 3 Characters Long" })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
