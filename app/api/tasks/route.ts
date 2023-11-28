import { JSDOM } from "jsdom";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const cookie = req.nextUrl.searchParams.get("cookie");
  const res = await fetch(
    `https://campusvirtual.mexico.unir.net/course/view.php?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        cookie: cookie || "",
      },
    }
  );
  const data = await res.text();
  const dom = new JSDOM(data);

  const assignmentContainers = dom.window.document.querySelectorAll(".assign");
  const quizContainers = dom.window.document.querySelectorAll(".quiz");
  const tasksContainer = Array.from(assignmentContainers).concat(
    Array.from(quizContainers)
  );

  const tasks = Array.from(tasksContainer)
    .map((container) => {
      const name = container.querySelector("span")?.textContent?.trim();
      const link = container.querySelector("a")?.href;
      const completionImage = container.querySelector("img.icon");
      const altAttribute =
        completionImage && completionImage.attributes.getNamedItem("alt");

      const isCompleted =
        !altAttribute?.value?.includes("No finalizado") &&
        !altAttribute?.value?.includes("Sin finalizar");

      return { name, link, isCompleted };
    })
    .filter((task) => task.name && task.link);

  return Response.json({
    laboratories: tasks.filter((task) => task.name?.includes("Laboratorio")),
    microtests: tasks.filter((task) => task.name?.includes("Microtest")),
    activities: tasks.filter((task) => task.name?.includes("Actividad")),
  });
}
