export interface TaskElement {
  name: string;
  link: string;
  isCompleted: boolean;
  deliveryDate?: string;
  timeLeft?: string;
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
