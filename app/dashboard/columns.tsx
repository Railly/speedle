import { ColumnDef } from "@tanstack/react-table";
import { Category, FlattenTask, translatedCategories } from "./utils";
import { Badge } from "@/components/ui/badge";

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
          return <>{cellValue.split("Examen")[0].split(":")[1]}</>;
        }
        if (cellValue.includes("Tarea")) {
          return <>{cellValue.split("Tarea")[0].split(":")[1]}</>;
        }
        return <>{cellValue.split(":")[1]}</>;
      }
      if (cellValue.includes("Examen")) {
        return <>{cellValue.split("Examen")[0]}</>;
      }
      return <>{info.getValue()}</>;
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: (info) => {
      return (
        <a
          href={info.getValue() as string}
          className="font-medium text-sky-600 hover:underline"
        >
          Link
        </a>
      );
    },
  },
  {
    accessorKey: "isCompleted",
    header: "Estado",
    cell: (info) => {
      return (
        <Badge variant={info.getValue() ? "success" : "destructive"}>
          {info.getValue() ? "Completed" : "Pending"}
        </Badge>
      );
    },
  },
];
