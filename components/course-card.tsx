"use client";
import { Course } from "@/app/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { cn, getCourseTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CourseCard({
  course,
  isSelected,
}: {
  course: Course;
  isSelected: boolean;
}) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/dashboard/courses/${course.id}`)}
      key={course.id}
      className={cn(
        "w-full cursor-pointer hover:shadow-lg hover:bg-amber-600/20 transition-all",
        {
          "border-l-8 border-amber-600/60 bg-amber-600/10": isSelected,
        }
      )}
    >
      <CardHeader className="border-b border-border">
        <CardTitle>{getCourseTitle(course.fullName)}</CardTitle>
        <CardDescription>
          <code className="text-xs">{course.shortName}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-sm text-gray-500">
          <span className="font-bold">{course.progress}%</span> completado
        </p>
        <Progress value={course.progress} />
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col w-[20ch]">
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
            className="text-sm font-medium text-sky-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver en Moodle
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
