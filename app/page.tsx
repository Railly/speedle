"use client";
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
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { login } from "./actions/login";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const devToolsSections = {
  en: {
    devTools: "DevTools",
    inspect: "Inspect",
    network: "Network",
    headers: "Headers",
    payload: "Payload",
  },
  es: {
    devTools: "Herramientas de Desarrollador",
    inspect: "Inspeccionar",
    network: "Red",
    headers: "Encabezados",
    payload: "Carga Útil",
  },
};

const initialState = {
  message: "",
};

export default function Home() {
  const [devToolsLanguage, setDevToolsLanguage] = useState<"en" | "es">("en");
  const [state, formAction] = useFormState(login, initialState);

  useEffect(() => {
    const browserLanguage = navigator.language;
    if (browserLanguage.startsWith("es")) {
      setDevToolsLanguage("es");
    } else {
      setDevToolsLanguage("es");
    }
  }, []);

  const sections =
    devToolsSections[devToolsLanguage as keyof typeof devToolsSections];

  return (
    <form
      action={formAction}
      className="flex flex-col items-center justify-center min-h-screen p-24"
    >
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Speedle</CardTitle>
          <CardDescription>
            Inicia sesión en Moodle y obtén tus credenciales
            <br />
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" className="p-0" variant="link">
                  ¿Cómo obtener mi <code>{"`sesskey`"}</code> y{" "}
                  <code>{"`cookie`"}</code>?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="prose">
                  <DialogTitle>
                    Obtén tu <code>sesskey</code> y <code>cookie</code>
                  </DialogTitle>
                  <DialogDescription>
                    Para acceder a tu cuenta de Moodle y obtener tus
                    credenciales de <code>sesskey</code> y <code>cookie</code>,
                    sigue estos pasos sencillos:
                    <ol>
                      <li>
                        <strong>Abre las {sections.devTools}</strong>: Presiona{" "}
                        <code>F12</code> o clic derecho en la página y
                        selecciona <code>{sections.inspect}</code>.
                      </li>
                      <li>
                        <strong>
                          Navega a la Pestaña de {sections.network}
                        </strong>
                        : Dentro de las {sections.devTools}, localiza y
                        selecciona la pestaña <code>{sections.network}</code>.
                      </li>
                      <li>
                        <strong>Busca Archivos JavaScript</strong>: Utiliza el
                        filtro para encontrar archivos con la extensión{" "}
                        <code>.js</code>, que son los archivos JavaScript.
                      </li>
                      <li>
                        <strong>Genera Tráfico en Moodle</strong>: Interactúa
                        con la página de Moodle para que las peticiones
                        aparezcan en la Pestaña <code>{sections.network}</code>.
                      </li>
                      <li>
                        <strong>Encuentra tus Credenciales</strong>:
                        <ul>
                          <li>
                            <strong>Cookie</strong>: Haz clic en cualquier
                            petición en la pestaña{" "}
                            <code>{sections.network}</code>, busca{" "}
                            <code>{sections.headers}</code>, y copia el valor de
                            la línea <code>Cookie</code>.
                          </li>
                          <li>
                            <strong>sesskey</strong>: En la misma petición,
                            busca <code>{sections.payload}</code> y copia el
                            valor del <code>sesskey</code>.
                          </li>
                        </ul>
                      </li>
                    </ol>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
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
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <p aria-live="polite" className="sr-only" role="status">
            {state?.message}
          </p>
          <Accordion className="w-full" type="single" collapsible>
            <AccordionItem className="prose" value="item-1">
              <AccordionTrigger className="py-2 text-start">
                ¿Por qué no solo mi usuario y contraseña?
              </AccordionTrigger>
              <AccordionContent>
                Moodle usa redirecciones para el inicio de sesión. Usar{" "}
                <code>sesskey</code> y <code>cookie</code> es más
                developer-friendly.
              </AccordionContent>
              <AccordionItem className="prose" value="item-2">
                <AccordionTrigger className="py-2 text-start">
                  ¿Por qué creaste Speedle?
                </AccordionTrigger>
                <AccordionContent>
                  <ol>
                    <li>
                      <strong>Carga lenta</strong>: Moodle es lento, y no
                      necesitamos toda la información que carga.
                    </li>
                    <li>
                      <strong>Interfaz poco amigable</strong>: Moodle no es
                      intuitivo, y no es fácil encontrar información.
                    </li>
                    <li>
                      <strong>Desafío personal</strong>: Me gusta aprender y
                      reinventar la rueda.
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending && <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />}
      Ingresar
    </Button>
  );
}
