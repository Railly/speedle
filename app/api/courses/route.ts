import { Course, CoursesResponse } from "@/app/interfaces";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const sesskey = req.nextUrl.searchParams.get("sesskey");
  const cookie = req.nextUrl.searchParams.get("cookie");
  const info = "core_course_get_enrolled_courses_by_timeline_classification";

  if (!sesskey) {
    return new Response(JSON.stringify({ message: "sesskey is required" }), {
      status: 400,
      statusText: "Bad Request",
    });
  }

  if (!cookie) {
    return redirect("https://spee-dle.vercel.app");
  }

  try {
    const response = await fetch(
      `https://campusvirtual.mexico.unir.net/lib/ajax/service.php?sesskey=${sesskey}&info=${info}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookie || "",
        },
        body: JSON.stringify([
          {
            args: {
              classification: "inprogress",
              customfieldname: "",
              customfieldvalue: "",
              limit: 0,
              offset: 0,
              sort: "fullname",
            },
            index: 0,
            methodname:
              "core_course_get_enrolled_courses_by_timeline_classification",
          },
        ]),
      }
    );
    if (response.status === 200) {
      const data: CoursesResponse = await response.json();

      if (data[0].error) {
        return new Response(JSON.stringify([]), {
          status: 500,
          statusText: "Internal Server Error",
        });
      }

      return new Response(
        JSON.stringify(
          data[0].data.courses
            .map(
              (course) =>
                ({
                  id: course.id,
                  fullName: course.fullname,
                  shortName: course.shortname,
                  viewUrl: course.viewurl,
                  progress: course.progress,
                  isFavorite: course.isfavourite,
                  isHidden: course.hidden,
                  courseCategory: course.coursecategory,
                  endDate: course.enddate,
                  startDate: course.startdate,
                } as Course)
            )
            .sort((a, b) => {
              if (a.fullName.includes("Percepción Computacional")) {
                return -1;
              }
              return a.fullName.localeCompare(b.fullName);
            })
        ),
        {
          status: 200,
          statusText: "OK",
        }
      );
    }
    return new Response(JSON.stringify(response), {
      status: 500,
      statusText: "Internal Server Error",
    });
  } catch (error: any) {
    return new Response(JSON.stringify(error), {
      status: 500,
      statusText: error.message,
    });
  }
}
