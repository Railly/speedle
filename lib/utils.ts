import { FlattenTask, Tasks } from "@/app/interfaces";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const translatedCategories = {
  laboratories: "Laboratorio",
  microtests: "Microtest",
  activities: "Actividad",
};

export const translatedEventTypes = {
  class: "Clase",
  exam: "Examen",
  other: "Otro",
};

export const getCourseTitle = (courseTitle?: string) =>
  courseTitle?.split(" - ")[0].replace(/MODAM\s?|\([^\)]+\)/g, "");

export const entries = <O extends object>(obj: O) =>
  Object.entries(obj) as { [K in keyof O]: [K, O[K]] }[keyof O][];

export const flattenTasks = (tasks: Tasks): FlattenTask[] => {
  const flatTasks = [];
  for (const [category, taskList] of entries(tasks)) {
    for (const task of taskList) {
      flatTasks.push({ ...task, category, id: task.link });
    }
  }
  return flatTasks;
};

const parseSpanishDate = (dateStr: string): Date | null => {
  const parts = dateStr.match(/(?:\w+, )?(\d+) de (\w+) de (\d+), (\d+):(\d+)/);
  if (!parts) return null;

  const [_, day, monthStr, year, hour, minute] = parts;
  const monthIndex = months[monthStr.toLowerCase() as keyof typeof months];
  if (monthIndex === undefined) return null;

  return new Date(
    parseInt(year),
    monthIndex,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
};

const months = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

const getMonthNumber = (monthName: string): number => {
  return months[monthName as keyof typeof months] ?? -1;
};

export const calculateTimeLeft = (deliveryDateStr: string): string => {
  const now = new Date();
  const deliveryDate = parseSpanishDate(deliveryDateStr);

  if (!deliveryDate) return "Formato de fecha no reconocido";

  const diff = deliveryDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Tiempo expirado";
  }

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days} días ${hours} horas`;
};
