import { calculateTimeLeft } from "@/lib/utils";
import { JSDOM } from "jsdom";
import type { NextRequest } from "next/server";

export const maxDuration = 300;

interface Task {
  name: string;
  link: string;
  isCompleted?: boolean | null;
  deliveryDate?: string;
  timeLeft?: string;
}

interface DetailedTask extends Task {
  deliveryDate: string;
  timeLeft: string;
}

interface CategorizedTasks {
  laboratories: DetailedTask[];
  microtests: DetailedTask[];
  activities: DetailedTask[];
}

export async function GET(req: NextRequest): Promise<Response> {
  const id = req.nextUrl.searchParams.get("id");
  const cookie = req.nextUrl.searchParams.get("cookie");

  if (!id) {
    return new Response(JSON.stringify({ message: "id is required" }), {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const coursePageResponse = await fetch(
    `https://campusvirtual.mexico.unir.net/course/view.php?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        cookie: cookie || "",
      },
    }
  );

  const coursePageData = await coursePageResponse.text();

  if (coursePageData.includes("alert-danger")) {
    return new Response(JSON.stringify([]), {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const dom = new JSDOM(coursePageData);
  const tasksContainer = dom.window.document.querySelectorAll(".assign, .quiz");

  const tasks: Task[] = Array.from(tasksContainer)
    .map((container) => {
      const name = container.querySelector("span")?.textContent?.trim() || "";
      const link = container.querySelector("a")?.href || "";
      const completionImage = container.querySelector("img.icon");
      const altAttribute = completionImage?.attributes.getNamedItem("alt");
      const isCompleted =
        altAttribute &&
        !altAttribute.value.includes("No finalizado") &&
        !altAttribute.value.includes("Sin finalizar");

      return { name, link, isCompleted };
    })
    .filter((task) => task.name && task.link);

  const fetchPromises = tasks.map((task) => fetchTaskDetails(task, cookie));

  const detailedTasks: DetailedTask[] = await Promise.all(fetchPromises);

  const categorizedTasks: CategorizedTasks = categorizeTasks(detailedTasks);

  return new Response(JSON.stringify(categorizedTasks));
}

async function fetchTaskDetails(
  task: Task,
  cookie: string | null
): Promise<DetailedTask> {
  if (task.isCompleted) return { ...task, deliveryDate: "-", timeLeft: "-" };

  const response = await fetch(task.link, {
    method: "GET",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      cookie: cookie || "",
    },
  });

  const data = await response.text();
  const dom = new JSDOM(data);
  let deliveryDate = "",
    timeLeft = "";

  if (task.link.includes("quiz")) {
    // Extract quiz-specific details
    const closeDateParagraph = Array.from(
      dom.window.document.querySelectorAll("p")
    ).find((p) => p.textContent?.includes("Este examen se cerrará en"));

    deliveryDate =
      closeDateParagraph?.textContent
        ?.replace("Este examen se cerrará en", "")
        .trim() || "";

    timeLeft = deliveryDate ? calculateTimeLeft(deliveryDate) : "";
  } else if (task.link.includes("assign")) {
    // Extract assignment-specific details
    const deliveryDateRow = Array.from(
      dom.window.document.querySelectorAll("th")
    ).find((th) => th.textContent?.includes("Fecha de entrega"));

    deliveryDate =
      deliveryDateRow?.nextElementSibling?.textContent?.trim() || "";

    const timeLeftRow = Array.from(
      dom.window.document.querySelectorAll("th")
    ).find((th) => th.textContent?.includes("Tiempo restante"));

    timeLeft = timeLeftRow?.nextElementSibling?.textContent?.trim() || "";
  }
  return {
    ...task,
    deliveryDate,
    timeLeft,
  };
}

function categorizeTasks(tasks: DetailedTask[]): CategorizedTasks {
  const categories: CategorizedTasks = {
    laboratories: [],
    microtests: [],
    activities: [],
  };

  tasks.forEach((task) => {
    if (task.name.includes("Laboratorio")) {
      categories.laboratories.push(task);
    } else if (task.name.includes("Microtest")) {
      categories.microtests.push(task);
    } else if (task.name.includes("Actividad")) {
      categories.activities.push(task);
    }
  });

  return categories;
}
