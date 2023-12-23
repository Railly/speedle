import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const login = async (formData: FormData) => {
  "use server";
  const sesskey = formData.get("sesskey");
  const cookie = formData.get("cookie");

  if (typeof sesskey === "string" && typeof cookie === "string") {
    const cookieStore = cookies();
    cookieStore.set("sesskey", sesskey);
    cookieStore.set("cookie", cookie);
    redirect("/dashboard");
  } else {
    throw new Error("Invalid form data");
  }
};

export default function Home() {
  return (
    <form
      action={login}
      className="flex flex-col items-center justify-center min-h-screen p-24"
    >
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Speedle</CardTitle>
          <CardDescription>
            Inicia sesión en Moodle y obtén tus credenciales
            <br />
            <a
              className="text-xs text-blue-500 hover:underline"
              href="https://moodle.org/mod/forum/discuss.php?d=417645"
              target="_blank"
              rel="noopener noreferrer"
            >
              ¿Cómo obtener mi <code>{"`sesskey`"}</code> y{" "}
              <code>{"`cookie`"}</code>?
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label className="text-sm font-medium" htmlFor="sesskey">
                sesskey
              </Label>
              <Input
                id="sesskey"
                name="sesskey"
                placeholder="sesskey"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label className="text-sm font-medium" htmlFor="cookie">
                cookie
              </Label>
              <Input id="cookie" name="cookie" placeholder="cookie" required />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button type="submit">Ingresar</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
