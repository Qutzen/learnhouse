import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
}

export function LessonItem({ lesson, slug, isActive, completed }: iAppProps) {
  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: completed ? "secondary" : "outline",
        className: cn(
          "w-full p-2.5 h-auto justify-start transition-all rounded-xs",
          completed &&
            "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
          isActive &&
            !completed &&
            "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary",
        ),
      })}
    >
      <div className="flex items-center gap-2.5 w-full">
        <p
          className={cn(
            "flex-1 text-xs font-medium line-clamp-2",
            completed
              ? "text-green-800 dark:text-green-200"
              : isActive
                ? "text-primary font-semibold"
                : "text-foreground",
          )}
        >
          {lesson.position}. {lesson.title}
        </p>

        {completed && (
          <span className="shrink-0 text-[10px] font-semibold text-green-700 dark:text-green-300">
            COMPLETED
          </span>
        )}
        {isActive && !completed && (
          <p className="text-[10px] text-primary font-medium uppercase">
            Learning
          </p>
        )}
      </div>
    </Link>
  );
}
