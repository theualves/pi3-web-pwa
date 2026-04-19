import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Definimos o contrato do que cada coluna precisa ter
export interface Column {
  header: string;
  accessor: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[]; // Em um cenário 100% tipado, usaríamos um Generic <T> aqui
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
          {/* Cabeçalho com fundo cinza super claro para destacar do corpo */}
          <TableRow className="bg-[#F28322] hover:bg-[#F28322]">
            {columns.map((col) => (
              <TableHead 
                key={col.accessor} 
                className="font-semibold text-white h-12"
              >
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
                    {col.accessor === "status" 
                      ? renderStatusBadge(row[col.accessor]) 
                      : row[col.accessor]}

                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-24 text-center text-slate-500"
              >
                Nenhum registo encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}