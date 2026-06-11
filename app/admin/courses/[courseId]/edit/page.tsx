import { getCourse } from "@/app/data/admin/get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "../_components/EditCourseForm";
import CourseStructure from "../_components/CourseStructure";

type Params = Promise<{ courseId: string }>;

export default async function EditRoute({ params }: { params: Params }) {
  const { courseId } = await params;
  const data = await getCourse(courseId);
  return (
    <div>
      <h1 className="text-3xl mb-8 font-black">
        Edit Course:{" "}
        <span className="text-primary underline">{data.title}</span>
      </h1>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12!">
          <TabsTrigger value="basic-info" className="h-full">
            Basic Info
          </TabsTrigger>

          <TabsTrigger value="course-structure" className="h-full">
            Course Structure
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Provide Basic Information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Here you can update your Course Structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
