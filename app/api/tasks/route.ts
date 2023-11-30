import { calculateTimeLeft } from "@/lib/utils";
import { JSDOM } from "jsdom";
import { NextRequest } from "next/server";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const cookie = req.nextUrl.searchParams.get("cookie");
  if (!id) {
    return new Response(JSON.stringify({ message: "id is required" }), {
      status: 400,
      statusText: "Bad Request",
    });
  }
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

  if (data.includes("alert-danger")) {
    return new Response(JSON.stringify([]), {
      status: 400,
      statusText: "Bad Request",
    });
  }
  const dom = new JSDOM(data);

  const assignmentContainers = dom.window.document.querySelectorAll(".assign");
  const quizContainers = dom.window.document.querySelectorAll(".quiz");
  const tasksContainer = Array.from(assignmentContainers).concat(
    Array.from(quizContainers)
  );

  const promises: { call: Promise<Response>; link: string; name: string }[] =
    [];

  const tasks = Array.from(tasksContainer)
    .map((container) => {
      const name = container.querySelector("span")?.textContent?.trim();
      const link = container.querySelector("a")?.href;
      if (link && name) {
        promises.push({
          call: fetch(link, {
            method: "GET",
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              cookie: cookie || "",
            },
          }),
          link,
          name,
        });
      }
      const completionImage = container.querySelector("img.icon");
      const altAttribute =
        completionImage && completionImage.attributes.getNamedItem("alt");

      const isCompleted =
        !altAttribute?.value?.includes("No finalizado") &&
        !altAttribute?.value?.includes("Sin finalizar");

      return { name, link, isCompleted };
    })
    .filter((task) => task.name && task.link);

  const responses = await Promise.all(
    promises.map((promise) => {
      return promise.call.then((response) => {
        if (promise.link.includes("quiz")) {
          return response.text().then((data) => {
            const dom = new JSDOM(data);
            const closeDateParagraph = Array.from(
              dom.window.document.querySelectorAll("p")
            ).find((p) => p.textContent?.includes("Este examen se cerrará en"));
            const deliveryDate = closeDateParagraph?.textContent
              ?.replace("Este examen se cerrará en", "")
              .trim();

            const timeLeft = deliveryDate
              ? calculateTimeLeft(deliveryDate)
              : "";

            return {
              ...promise,
              deliveryDate,
              timeLeft,
            };
          });
        }
        if (promise.link.includes("assign")) {
          return response.text().then((data) => {
            const dom = new JSDOM(data);

            const deliveryDateRow = Array.from(
              dom.window.document.querySelectorAll("th")
            ).find((th) => th.textContent?.includes("Fecha de entrega"));
            const deliveryDate =
              deliveryDateRow?.nextElementSibling?.textContent?.trim();

            const timeLeftRow = Array.from(
              dom.window.document.querySelectorAll("th")
            ).find((th) => th.textContent?.includes("Tiempo restante"));
            const timeLeft =
              timeLeftRow?.nextElementSibling?.textContent?.trim();

            return {
              ...promise,
              deliveryDate,
              timeLeft,
            };
          });
        }
      });
    })
  ).then((responses) => responses);

  const laboratories = tasks.filter((task) =>
    task.name?.includes("Laboratorio")
  );
  const microtests = tasks.filter((task) => task.name?.includes("Microtest"));
  const activities = tasks.filter((task) => task.name?.includes("Actividad"));

  const laboratoriesWithResponses = laboratories.map((laboratory) => {
    const response = responses.find((response) =>
      response?.name?.includes(laboratory.name || "")
    );
    return {
      ...laboratory,
      deliveryDate: response?.deliveryDate,
      timeLeft: response?.timeLeft,
    };
  });

  const microtestsWithResponses = microtests.map((microtest) => {
    const response = responses.find((response) =>
      response?.name?.includes(microtest.name || "")
    );
    return {
      ...microtest,
      deliveryDate: response?.deliveryDate,
      timeLeft: response?.timeLeft,
    };
  });

  const activitiesWithResponses = activities.map((activity) => {
    const response = responses.find((response) =>
      response?.name?.includes(activity.name || "")
    );
    return {
      ...activity,
      deliveryDate: response?.deliveryDate,
      timeLeft: response?.timeLeft,
    };
  });

  return Response.json({
    laboratories: laboratoriesWithResponses,
    microtests: microtestsWithResponses,
    activities: activitiesWithResponses,
  });
}
