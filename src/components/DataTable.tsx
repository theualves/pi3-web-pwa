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
  
  // Função auxiliar para pintar as etiquetas baseadas no texto
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
        // Caso venha um status não mapeado, renderiza uma badge cinza padrão
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md bg-white overflow-hidden">
      <Table>
        <TableHeader>
          {/* Cabeçalho com fundo cinza super claro para destacar do corpo */}
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            {columns.map((col) => (
              <TableHead 
                key={col.accessor} 
                className="font-semibold text-slate-600 h-12"
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
                    
                    {/* A MÁGICA ACONTECE AQUI: 
                        Se a coluna for "status", em vez de mostrar o texto simples, 
                        chamamos a função que desenha a etiqueta colorida. */}
                    {col.accessor === "status" 
                      ? renderStatusBadge(row[col.accessor]) 
                      : row[col.accessor]}

                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Tratamento elegante caso a tabela não tenha dados
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