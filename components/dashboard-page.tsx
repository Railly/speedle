import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseCard from "@/components/course-card";
import {
  flattenTasks,
  getCourseTitle,
  translatedEventTypes,
} from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { Course, Tasks, Event } from "@/app/interfaces";
import { DataTable } from "@/app/dashboard/data-table";

export default async function DashboardPage({
  params,
}: {
  params?: {
    id: string;
  };
}) {
  const cookieStore = cookies();
  const sesskey = cookieStore.get("sesskey");
  const cookie = cookieStore.get("cookie");
  const courses: Course[] = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/get-relevant-courses?sesskey=${sesskey?.value}&cookie=${cookie?.value}`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return [];
    });
  const currentCourse = params?.id
    ? courses?.find((course) => String(course.id) === params.id)
    : courses[0];
  const tasks: Tasks = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/get-all-tasks?id=${currentCourse?.id}&cookie=${cookie?.value}`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
      return [];
    });

  const events: Event[] = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/get-upcoming-events?cookie=${cookie?.value}`
  )
    .then((res) => res.json())
    .catch(() => []);

  const flattenedTasks = flattenTasks(tasks);

  if (!currentCourse) {
    redirect("/");
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex gap-8">
        <div className="sticky flex flex-col self-start gap-4 top-4">
          <h2 className="text-2xl font-bold">Speedle</h2>
          <div className="flex gap-4 ">
            {courses?.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={course.id === currentCourse?.id}
              />
            ))}
          </div>
          <div className="w-full mt-4">
            <h3 className="mb-4 text-xl font-bold">
              Tareas de {getCourseTitle(currentCourse?.fullName)}
            </h3>
            <DataTable data={flattenedTasks} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="inline-flex items-center gap-1.5 text-xl font-bold">
            <CalendarIcon width={20} height={20} />
            Próximos eventos
          </h3>
          {(events || [])?.map((event) => (
            <Card key={event.courseId} className="w-full">
              <CardHeader className="border-b border-border">
                <CardTitle>{event.courseName}</CardTitle>
                {getCourseTitle(event.courseTitle) !== event.courseName && (
                  <CardDescription>
                    <code className="text-xs">
                      {getCourseTitle(event.courseTitle)}
                    </code>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Badge
                    variant={
                      event.eventType === "class"
                        ? "amber"
                        : event.eventType === "exam"
                        ? "destructive"
                        : "secondary"
                    }
                    className="mb-2"
                  >
                    {translatedEventTypes[event.eventType]}
                  </Badge>
                  <div className="flex gap-2">
                    <p className="font-mono text-sm text-gray-500">
                      {event.date}:
                    </p>
                    <p className="font-mono text-sm text-gray-500">
                      {event.startTime}
                      {event.endTime && <> - {event.endTime}</>}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <a
                  href={event.eventUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-sky-600 hover:underline"
                >
                  {event.eventType === "class"
                    ? "Unirse a la clase"
                    : "Ver en Moodle"}
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
