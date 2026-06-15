"use client";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct";
import { IconBrandYoutubeKids } from "@tabler/icons-react";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { markLessonComplete } from "../actions";

interface iAppProps {
  data: LessonContentType;
}

interface VideoPlayerProps {
  thumbnailKey: string;
  videoKey: string;
}

function VideoPlayer({ thumbnailKey, videoKey }: VideoPlayerProps) {
  const videoUrl = useConstructUrl(videoKey);
  const thumbnailUrl = useConstructUrl(thumbnailKey);

  if (!videoKey) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
        <IconBrandYoutubeKids className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">
          This lesson does not have a video yet
        </p>
      </div>
    );
  }
  return (
    <div className="aspect-video bg-black rounded-lg relative overflow-hidden shadow-lg">
      <video className="w-full h-full" controls poster={thumbnailUrl}>
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg  " />
        your browser does not support the video tag.
      </video>
    </div>
  );
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.chapter.course.slug),
      );

      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <div className="w-[90%] max-w-6xl mx-auto">
        <VideoPlayer
          thumbnailKey={data.thumbnailKey ?? ""}
          videoKey={data.videoKey ?? ""}
        />
        <div className="py-5 border-b">
          {data.lessonProgress.length > 0 ? (
            <Button
              variant="outline"
              className="rounded-md bg-green-500/10 text-green-500 hover:text-green-600"
            >
              Completed
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-md"
              onClick={onSubmit}
              disabled={pending}
            >
              Mark as Complete
            </Button>
          )}
        </div>
        <div className="space-y-3 pt-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {data.title}
          </h1>
          {data.description && (
            <RenderDescription json={JSON.parse(data.description)} />
          )}
        </div>
      </div>
    </div>
  );
}
