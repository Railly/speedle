import { DataTable } from "../../data-table";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import CourseCard from "@/components/course-card";
import { Course, Event, Tasks } from "../../../interfaces";
import {
  flattenTasks,
  getCourseTitle,
  getTimeLeftPercentage,
  translatedEventTypes,
} from "@/lib/utils";
import { AngleIcon, CalendarIcon, GridIcon } from "@radix-ui/react-icons";

export default async function Dashboard({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const cookieStore = cookies();
  const sesskey = cookieStore.get("sesskey");
  const cookie = cookieStore.get("cookie");
  const courses: Course[] = await fetch(
    `http://localhost:3000/api/courses?sesskey=${sesskey?.value}&cookie=${cookie?.value}`
  ).then((res) => res.json());
  const tasks: Tasks = await fetch(
    `http://localhost:3000/api/tasks?id=${params.id}&cookie=${cookie?.value}`
  ).then((res) => res.json());

  const events: Event[] = await fetch(
    `http://localhost:3000/api/calendar?cookie=${cookie?.value}`
  ).then((res) => res.json());

  const flattenedTasks = flattenTasks(tasks);

  return (
    <div className="container p-4 mx-auto">
      <div className="flex gap-8">
        <div className="sticky flex flex-col self-start gap-4 top-4">
          <h2 className="text-2xl font-bold inline-flex gap-1.5 items-center">
            <AngleIcon height={24} width={24} />
            Speedle
          </h2>
          <div className="flex gap-4 ">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={String(course.id) === params.id}
              />
            ))}
          </div>
          <div className="w-full mt-4">
            <h3 className="mb-4 text-xl font-bold inline-flex items-center gap-1.5">
              <GridIcon height={20} width={20} />
              Tareas de{" "}
              <span className="underline">
                {getCourseTitle(
                  courses.find((course) => String(course.id) === params.id)
                    ?.fullName
                )}
              </span>
            </h3>
            <DataTable data={flattenedTasks} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="inline-flex items-center gap-1.5 text-xl font-bold">
            <CalendarIcon width={20} height={20} />
            Próximos eventos
          </h3>
          {events.map((event) => (
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
                <Progress
                  value={getTimeLeftPercentage(
                    event.date,
                    event.startTime,
                    event.endTime
                  )}
                />
              </CardContent>
              <CardFooter>
                <a
                  href={event.eventUrl || "#"}
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
