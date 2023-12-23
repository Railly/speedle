import { Event } from "@/app/interfaces";
import { JSDOM } from "jsdom";
import { NextRequest } from "next/server";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const cookie = req.nextUrl.searchParams.get("cookie");
  const res = await fetch(
    `https://campusvirtual.mexico.unir.net/calendar/view.php?view=upcoming`,
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
  const document = dom.window.document;

  let events: Event[] = [];

  const eventElements = document.querySelectorAll("[data-type=event]");

  eventElements?.forEach((event) => {
    let courseId = event.getAttribute("data-course-id") || "";
    let courseName = event.querySelector(".name")?.textContent || "";
    let dateTimeText = event.querySelector(".col-11")?.textContent || "";
    let date, startTime, endTime;

    let parts = (dateTimeText?.split(",") || []).map((part) => part.trim());

    if (parts.length === 3 && isNaN(Date.parse(parts[0]))) {
      date = parts.slice(0, 2).join(", ");
      startTime = parts[2];
    } else {
      date = parts[0];
      startTime = parts[1];
      if (startTime.includes("»")) {
        [startTime, endTime] = startTime?.split("»").map((s) => s.trim());
      }
    }
    let eventType: Event["eventType"] = "other";
    let eventUrl: string | undefined;

    const anchors = event.querySelectorAll(
      ".card a"
    ) as NodeListOf<HTMLAnchorElement>;
    if (anchors) {
      Array.from(anchors).some((anchor) => {
        if (anchor.textContent?.includes("Clases en directo")) {
          eventUrl = anchor.href;
          eventType = "class";
          return true;
        }
        return false;
      });
    }

    if (!eventUrl) {
      Array.from(anchors).some((anchor) => {
        if (anchor.textContent?.includes("Comenzar el examen ya")) {
          eventUrl = anchor.href;
          eventType = "exam";
          return true;
        }
        return false;
      });
    }
    if (!eventUrl) {
      const firstLink = anchors[1];
      if (firstLink) {
        eventUrl = firstLink.href;
      }
    }

    let courseTitle: string | undefined;
    let group: string | undefined;

    // Extract the course name from the link within the event card
    const courseLinkElement = event.querySelector(
      '.col-11 a[href*="course/view.php?id"]'
    );
    if (courseLinkElement) {
      courseTitle = courseLinkElement.textContent?.trim();
    }

    // Find the element containing the group number by checking the text content
    const col11s = event.querySelectorAll(".col-11");
    if (col11s) {
      Array.from(col11s).forEach((col) => {
        if ((col.textContent || "")?.includes("Grupo")) {
          group = (col.textContent || "")?.split("Grupo")[1]?.trim();
        }
      });
    }

    events.push({
      courseId,
      courseName,
      date,
      startTime,
      endTime,
      eventType,
      eventUrl,
      courseTitle,
      group,
    });
  });

  return new Response(JSON.stringify(events));
}
