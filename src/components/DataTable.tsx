import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Importação adicionada
import { Eye, Pencil, Trash2 } from "lucide-react";

export interface Column {
  header: string;
  accessor: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

export function DataTable({ columns, data }: DataTableProps) {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Aprovado":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
            Aprovado
          </Badge>
        );
      case "Pendente":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">
            Pendente
          </Badge>
        );
      case "Recusado":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
            Recusado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md bg-[#EDEDED] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F28322] hover:bg-[#F28322]">
            {columns.map((col) => (
              <TableHead key={col.accessor} className="font-semibold text-white h-12">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col.accessor} className="py-4 align-middle">
                    {/* Lógica unificada para evitar duplicidade */}
                    {col.accessor === "acoes" ? (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#004A8D]">
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-600">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ) : col.accessor === "status" ? (
                      renderStatusBadge(row[col.accessor])
                    ) : (
                      row[col.accessor]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
