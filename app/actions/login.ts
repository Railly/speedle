"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const sesskey = formData.get("sesskey");
  const cookie = formData.get("cookie");

  if (typeof sesskey === "string" && typeof cookie === "string") {
    const cookieStore = cookies();
    cookieStore.set("sesskey", sesskey);
    cookieStore.set("cookie", cookie);
    redirect("/dashboard");
    return { message: `Logged in` };
  } else {
    return { message: "Failed to login" };
  }
}

export async function createTodo(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  try {
    revalidatePath("/");
    return { message: `Added todo` };
  } catch (e) {
    return { message: "Failed to create todo" };
  }
}
