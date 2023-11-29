export interface TaskElement {
  name: string;
  link: string;
  isCompleted: boolean;
}

export interface Tasks {
  laboratories: TaskElement[];
  microtests: TaskElement[];
  activities: TaskElement[];
}

export interface FlattenTask extends TaskElement {
  id: string;
  category: string;
}

export type Category = keyof Tasks;

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

export interface Course {
  id: number;
  fullName: string;
  shortName: string;
  viewUrl: string;
  progress: number;
  isFavorite: boolean;
  isHidden: boolean;
  courseCategory: string;
  endDate: number;
  startDate: number;
}

interface OriginalCourse {
  id: number;
  fullname: string;
  shortname: string;
  idnumber: string;
  summary: string;
  summaryformat: number;
  startdate: number;
  enddate: number;
  visible: boolean;
  fullnamedisplay: string;
  viewurl: string;
  courseimage: string;
  progress: number;
  hasprogress: boolean;
  isfavourite: boolean;
  hidden: boolean;
  showshortname: boolean;
  coursecategory: string;
}

export type CoursesResponse = [
  {
    error: string;
    data: {
      courses: Array<OriginalCourse>;
    };
  }
];

const getMonthNumber = (monthName: string): number => {
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
  return months[monthName as keyof typeof months] ?? -1;
};

export interface Event {
  courseId: string;
  courseName: string;
  date: string;
  startTime?: string;
  endTime?: string;
  eventUrl?: string | null;
  eventType: "class" | "exam" | "other";
  courseTitle?: string;
  group?: string;
}

export const getTimeLeftPercentage = (
  date: "Hoy" | "Mañana" | string,
  startTime?: string,
  endTime?: string
): number => {
  if (!startTime) {
    console.error("No start time provided");
    return 0;
  }
  const now = new Date();
  let eventStartDate = new Date();
  let eventEndDate = new Date();

  if (date === "Hoy") {
  } else if (date === "Mañana") {
    eventStartDate.setDate(now.getDate() + 1);
    eventEndDate.setDate(now.getDate() + 1);
  } else {
    const [dayOfWeek, dayMonth] = date.split(", ");
    const [day, monthName] = dayMonth.split(" ");

    const month = getMonthNumber(monthName.toLowerCase());
    if (month === -1) {
      console.error("Invalid month name");
      return 0;
    }

    const year = now.getFullYear();
    eventStartDate = new Date(year, month, parseInt(day));
    eventEndDate = new Date(year, month, parseInt(day));
  }

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  eventStartDate.setHours(startHours, startMinutes);
  if (endTime) {
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    eventEndDate.setHours(endHours, endMinutes);
  } else {
    eventEndDate = new Date(eventStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  const totalDuration = eventEndDate.getTime() - now.getTime();
  let timeLeft = eventStartDate.getTime() - now.getTime();

  if (timeLeft < 0) {
    return 100;
  }

  const percentageLeft = (timeLeft / totalDuration) * 100;

  return percentageLeft;
};
