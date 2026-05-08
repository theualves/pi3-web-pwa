"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";

export interface Column {
  header: string;
  accessor: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onViewClick?: (row: any) => void;
  onEditClick?: (row: any) => void;
  onDeleteClick?: (row: any) => void;
}

export function DataTable({ columns, data, onViewClick, onEditClick, onDeleteClick }: DataTableProps) {
  
  const renderStatusBadge = (status: string) => {
    const statusNormalizado = status?.toUpperCase() || "";

    if (statusNormalizado.includes("APROVAD") || statusNormalizado === "ATIVO") {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-300 border-none shadow-xs">
          {statusNormalizado === "ATIVO" ? "Ativo" : "Aprovada"}
        </Badge>
      );
    }
    if (statusNormalizado.includes("PENDENTE")) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none shadow-xs">
          Pendente
        </Badge>
      );
    }
    if (statusNormalizado.includes("RECUSAD") || statusNormalizado.includes("REJEITADA") || statusNormalizado === "INATIVO") {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none shadow-xs">
          {statusNormalizado === "INATIVO" ? "Inativo" : "Rejeitada"}
        </Badge>
      );
    }
    
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="rounded-md bg-[#EDEDED] overflow-hidden">
      <Table>
        <TableHeader>
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
              <TableRow key={rowIndex} className="hover:bg-gray-50 bg-white border-b border-gray-200">
                {columns.map((col) => (
                  <TableCell key={col.accessor} className="py-4 align-middle">
                    {col.accessor === "acoes" ? (
                      <div className="flex items-center gap-2">
                        
                        {onViewClick && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white text-slate-500 hover:text-[#004A8D] shadow-xs border border-gray-100"
                            onClick={() => onViewClick(row)}
                          >
                            <Eye className="size-4 mr-2" />
                            Visualizar
                          </Button>
                        )}

                        {onEditClick && (row.podeEditar !== false) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white text-slate-500 hover:text-amber-600 shadow-xs border border-gray-100"
                            onClick={() => onEditClick(row)}
                          >
                            <Pencil className="size-4 mr-2" />
                            Editar
                          </Button>
                        )}

                        {onDeleteClick && (row.podeExcluir !== false) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white text-slate-500 hover:text-red-600 shadow-xs border border-gray-100"
                            onClick={() => onDeleteClick(row)}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Excluir
                          </Button>
                        )}

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
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-slate-500 bg-white"
              >
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}