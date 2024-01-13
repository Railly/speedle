import { ColumnDef } from "@tanstack/react-table";
import { Category, FlattenTask } from "../interfaces";
import { Badge } from "@/components/ui/badge";
import { translatedCategories } from "@/lib/utils";
import { CaretSortIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<FlattenTask>[] = [
  {
    accessorKey: "category",
    header: "Categoría",
    enableGrouping: true,
    cell: ({ row, getValue }) => {
      const value = getValue() as Category;
      const getVariant = () => {
        switch (value) {
          case "activities":
            return "amber";
          case "laboratories":
            return "purple";
          case "microtests":
            return "cyan";
          default:
            return "default";
        }
      };
      return (
        <Badge variant={getVariant()}>{translatedCategories[value]}</Badge>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Nombre",
    cell: (info) => {
      const cellValue = info.getValue() as string;
      if (cellValue.includes(":")) {
        if (cellValue.includes("Examen")) {
          return <>{cellValue?.split("Examen")[0]?.split(":")[1]}</>;
        }
        if (cellValue.includes("Tarea")) {
          return <>{cellValue?.split("Tarea")[0]?.split(":")[1]}</>;
        }
        return <>{cellValue?.split(":")[1]}</>;
      }
      if (cellValue.includes("Examen")) {
        return <>{cellValue?.split("Examen")[0]}</>;
      }
      return <>{info.getValue()}</>;
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Fecha de entrega",
    cell: (info) => {
      const value = info.getValue() as string;
      if (value === "-") return <div className="w-[13rem]">-</div>;
      const splitValue = value?.split(", ");
      return (
        <div className="w-[13rem]">{splitValue[1] + ", " + splitValue[2]}</div>
      );
    },
  },
  {
    accessorKey: "timeLeft",
    header: "Tiempo restante",
    cell: (info) => {
      return <div className="w-[8rem]">{info.getValue() as string}</div>;
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: (info) => {
      return (
        <a
          href={info.getValue() as string}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-sky-600 hover:underline"
        >
          Link
          <OpenInNewWindowIcon />
        </a>
      );
    },
  },
  {
    accessorKey: "isCompleted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <CaretSortIcon className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: (info) => {
      return (
        <Badge variant={info.getValue() ? "success" : "destructive"}>
          {info.getValue() ? "Completed" : "Pending"}
        </Badge>
      );
    },
  },
];
