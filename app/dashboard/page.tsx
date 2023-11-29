import {
  Course,
  Event,
  FlattenTask,
  Tasks,
  getCourseTitle,
  getTimeLeftPercentage,
  translatedEventTypes,
} from "./utils";
import { DataTable } from "./data-table";
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

export const entries = <O extends object>(obj: O) =>
  Object.entries(obj) as { [K in keyof O]: [K, O[K]] }[keyof O][];

const flattenTasks = (tasks: Tasks): FlattenTask[] => {
  const flatTasks = [];
  for (const [category, taskList] of entries(tasks)) {
    for (const task of taskList) {
      flatTasks.push({ ...task, category, id: task.link });
    }
  }
  return flatTasks;
};

export default async function Dashboard() {
  const cookieStore = cookies();
  const sesskey = cookieStore.get("sesskey");
  const cookie = cookieStore.get("cookie");
  const courses: Course[] = await fetch(
    `http://localhost:3000/api/courses?sesskey=${sesskey?.value}&cookie=${cookie?.value}`
  ).then((res) => res.json());
  const currentCourse = courses[0];
  const tasks: Tasks = await fetch(
    `http://localhost:3000/api/tasks?id=${currentCourse.id}&cookie=${cookie?.value}`
  ).then((res) => res.json());

  const events: Event[] = await fetch(
    `http://localhost:3000/api/calendar?cookie=${cookie?.value}`
  ).then((res) => res.json());

  const flattenedTasks = flattenTasks(tasks);

  return (
    <div className="container p-4 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Mis Cursos</h2>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="w-full">
              <CardHeader>
                <CardTitle>
                  {course.fullName
                    .split(" - ")[0]
                    .replace(/MODAM\s?|\([^\)]+\)/g, "")}
                </CardTitle>
                {/* <CardDescription>
                  <code>{course.shortName}</code>
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm text-gray-500">
                  <span className="font-bold">{course.progress}%</span>{" "}
                  completado
                </p>
                <Progress value={course.progress} />
              </CardContent>
              {/* <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col w-[20ch]">
                    <span className="text-sm text-gray-500">
                      {course.courseCategory.split(" - ")[0]}
                    </span>
                    <code className="mt-1 text-xs text-gray-400">
                      <span className="font-semibold">Inicio: </span>
                      {new Date(course.startDate * 1000).toLocaleDateString()}
                    </code>
                    <code className="mt-1 text-xs text-gray-400">
                      <span className="font-semibold">Fin: </span>
                      {new Date(course.endDate * 1000).toLocaleDateString()}
                    </code>
                  </div>
                  <a
                    href={course.viewUrl}
                    className="font-semibold text-sky-600 hover:underline"
                  >
                    Ver en Moodle
                  </a>
                </div>
              </CardFooter> */}
            </Card>
          ))}
        </div>
        <DataTable data={flattenedTasks} />
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <Card key={event.courseId} className="w-full">
              <CardHeader className="border border-b border-border">
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
