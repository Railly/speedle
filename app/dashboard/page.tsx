import { Course, FlattenTask, Tasks } from "./utils";
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
      </div>
    </div>
  );
}
