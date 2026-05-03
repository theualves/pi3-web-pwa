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
  // 👇 NOVAS PROPS OPCIONAIS PARA NÃO QUEBRAR O SISTEMA
  onEditClick?: (row: any) => void;
  onDeleteClick?: (row: any) => void;
}

export function DataTable({ columns, data, onViewClick, onEditClick, onDeleteClick }: DataTableProps) {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Aprovado":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-300 border-none shadow-xs">
            Aprovado
          </Badge>
        );
      case "Pendente":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none shadow-xs">
            Pendente
          </Badge>
        );
      case "Recusado":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none shadow-xs">
            Recusado
          </Badge>
        );
      case "Ativo":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-xs">
            Ativo
          </Badge>
        );
      case "Inativo":
        return (
          <Badge className="bg-white text-gray-600 hover:bg-gray-300 border-none shadow-xs">
            Inativo
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
                    {col.accessor === "acoes" ? (
                      <div className="flex items-center gap-2">
                        
                        {/* Botão Visualizar: Aparece se a prop onViewClick for passada */}
                        {onViewClick && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white text-slate-500 hover:text-[#004A8D] shadow-xs"
                            onClick={() => onViewClick(row)}
                          >
                            <Eye className="size-4 mr-2" />
                            Visualizar
                          </Button>
                        )}

                        {/* Botão Editar: Só aparece se onEditClick for passado E status for "Recusado" */}
                        {onEditClick && row.status === "Recusado" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white text-slate-500 hover:text-amber-600 shadow-xs"
                            onClick={() => onEditClick(row)}
                          >
                            <Pencil className="size-4 mr-2" />
                            Editar
                          </Button>
                        )}

                        {/* Botão Excluir: Só aparece se onDeleteClick for passado E status for "Recusado" */}
                        {onDeleteClick && row.status === "Recusado" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white text-slate-500 hover:text-red-600 shadow-xs"
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
                className="h-24 text-center text-slate-500"
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