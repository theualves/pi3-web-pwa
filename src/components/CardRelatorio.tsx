"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Download, Eye, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardRelatorioProps {
  relatorio: any; 
}

export function CardRelatorio({ relatorio }: CardRelatorioProps) {
  const [expandido, setExpandido] = useState(false);

  // Formata a data de validação (ou a data de criação como fallback)
  const dataFormatada = new Date(relatorio.dataValidacao || relatorio.createdAt).toLocaleDateString("pt-BR");

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-200 hover:shadow-md">
      <div
        onClick={() => setExpandido(!expandido)}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
      >
        <div className="flex flex-wrap sm:items-center gap-4 w-full">
          <div className="flex items-center gap-4 min-w-0">
            <div className="bg-[#378bf8] p-4 rounded-full text-[#004A8D]">
              <FileText className="size-8"  />
            </div>
            <div>
              {/* CORREÇÃO: Título da atividade no lugar do nome do coordenador */}
              <h3 className="text-xl font-bold text-slate-800">
                {relatorio.titulo || "Atividade Complementar"}
              </h3>
              {/* CORREÇÃO: Data no lugar do ID */}
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <Calendar className="size-4" />
                Data do Parecer:{" "}
                <span className="font-medium text-slate-700">
                  {dataFormatada}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* CORREÇÃO: Dados alinhados e sem repetições */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm w-full md:w-auto mt-4 md:mt-0">
          <div>
            <p className="text-blue-600 font-bold uppercase text-[10px] tracking-wider mb-1">Status</p>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {relatorio.status === "APROVADA" ? "Aprovada" : relatorio.status}
            </span>
          </div>
          <div>
            <p className="text-blue-600 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
               Validado por
            </p>
            <p className="font-semibold text-slate-700">
              {/* Verifica se o nome vem aninhado no objeto validadaPor ou direto */}
              {relatorio.validadaPor?.nome || relatorio.nomeCoordenador || "Sistema"}
            </p>
          </div>
        </div>

        <div className="flex items-center mt-2 md:mt-0">
          {expandido ? (
            <ChevronUp className="size-6 text-slate-400" />
          ) : (
            <ChevronDown className="size-6 text-slate-400" />
          )}
        </div>
      </div>

      {expandido && (
        <div className="p-6 border-t border-slate-100 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Descrição da Atividade</h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 md:min-h-[120px] rounded-md border border-slate-200 shadow-sm">
                {relatorio.descricao || "Sem descrição informada pelo estudante."}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Detalhes Técnicos</h4>
                <div className="flex gap-4">
                   <div className="bg-white p-3 rounded-md border border-slate-200 flex-1 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
                        <Clock className="size-3" /> Horas Aprovadas
                      </p>
                      <p className="text-lg font-bold text-emerald-600">{relatorio.horasAprovadas || 0}h</p>
                   </div>
                   <div className="bg-white p-3 rounded-md border border-slate-200 flex-1 shadow-sm">
                      <p className="text-[10px] text-slate-400 uppercase mb-1">Categoria</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">{relatorio.categoria || "Geral"}</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 flex gap-3 pt-2">
                {relatorio.comprovante ? (
                  <a 
                    href={`https://api-horas-complementares.onrender.com/${relatorio.comprovante}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-[#004A8D] hover:bg-[#003666] text-white flex gap-2">
                      <Eye className="size-4" /> Visualizar Comprovante
                    </Button>
                  </a>
                ) : (
                  <Button disabled className="w-full bg-slate-200 text-slate-500 flex gap-2">
                    <Eye className="size-4" /> Sem Anexo
                  </Button>
                )}
                
                <Button variant="outline" className="flex-1 gap-2 text-slate-700 border-slate-300 bg-white hover:bg-slate-50">
                  <Download className="size-4" /> Baixar Recibo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}