"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardRelatorioProps {
  relatorio: {
    id: string;
    nomeCoordenador: string;
    curso: string;
    dataEnvio: string;
    descricao: string;
  };
}

export function CardRelatorio({ relatorio }: CardRelatorioProps) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-200">
      <div
        onClick={() => setExpandido(!expandido)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors w-full">
          <div className="flex items-center gap-4 min-w-[250px]">
            <div className="bg-[#378bf8] p-4 rounded-full text-[#004A8D]">
              <FileText className="size-8"  />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {relatorio.nomeCoordenador}
              </h3>
              <p className="text-sm text-slate-500">
                Id:{" "}
                <span className="font-medium text-slate-700">
                  {relatorio.id}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold text-slate-800">
              <span className="text-blue-500">Curso:</span> {relatorio.curso}
            </h3>
            <h3 className="text-md font-semibold text-slate-800">
              <span className="text-blue-500">Atividade:</span> {relatorio.curso}
            </h3>
          </div>

          <div>
            <h3 className="text-md font-semibold text-slate-800">
              <span className="text-blue-500">Coordenador:</span> {relatorio.nomeCoordenador}
            </h3>
            <h3 className="text-md font-semibold text-slate-800">
              <span className="text-blue-500">Data:</span> {relatorio.dataEnvio}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {expandido ? (
            <ChevronUp className="size-5 text-slate-400" />
          ) : (
            <ChevronDown className="size-5 text-slate-400" />
          )}
        </div>
      </div>

      {expandido && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-1">
              Descrição do Relatório:
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {relatorio.descricao}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <Button className="bg-[#004A8D] hover:bg-[#003666] text-white flex gap-2">
              <Eye className="size-4" />
              Visualizar
            </Button>
            <Button
              variant="outline"
              className="flex gap-2 text-slate-700 border-slate-300"
            >
              <Download className="size-4" />
              Baixar PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
