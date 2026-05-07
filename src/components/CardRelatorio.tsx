"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Download, Eye, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardRelatorioProps {
  relatorio: any; // Usando any para facilitar o acesso ao JSON aninhado
}

export function CardRelatorio({ relatorio }: CardRelatorioProps) {
  const [expandido, setExpandido] = useState(false);

  // Formatação de data simples
  const dataFormatada = new Date(relatorio.createdAt).toLocaleDateString("pt-BR");

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-200 hover:shadow-md">
      <div
        onClick={() => setExpandido(!expandido)}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
      >
        <div className="flex items-center gap-5 flex-1">
          <div className="bg-blue-50 p-4 rounded-xl text-[#004A8D]">
            <FileText className="size-8" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800 leading-tight">
              {relatorio.titulo}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User className="size-3" /> {relatorio.aluno?.usuario?.nome}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" /> {dataFormatada}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <p className="text-blue-600 font-bold uppercase text-[10px] tracking-wider">Curso</p>
            <p className="font-semibold text-slate-700">{relatorio.aluno?.curso?.nome}</p>
          </div>
          <div>
            <p className="text-blue-600 font-bold uppercase text-[10px] tracking-wider">Validado por</p>
            <p className="font-semibold text-slate-700">{relatorio.validadaPor?.nome}</p>
          </div>
        </div>

        <div className="flex items-center ml-auto">
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
              <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded-md border border-slate-200">
                {relatorio.descricao || "Sem descrição informada."}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Detalhes Técnicos</h4>
                <div className="flex gap-4">
                   <div className="bg-white p-2 rounded border border-slate-200 flex-1">
                      <p className="text-[10px] text-slate-400 uppercase">Horas Aprovadas</p>
                      <p className="text-lg font-bold text-emerald-600">{relatorio.horasAprovadas}h</p>
                   </div>
                   <div className="bg-white p-2 rounded border border-slate-200 flex-1">
                      <p className="text-[10px] text-slate-400 uppercase">Categoria</p>
                      <p className="text-lg font-bold text-slate-700">{relatorio.categoria}</p>
                   </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a 
                  href={`http://localhost:3001/${relatorio.comprovante}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-[#004A8D] hover:bg-[#003666] text-white flex gap-2">
                    <Eye className="size-4" /> Visualizar Comprovante
                  </Button>
                </a>
                <Button variant="outline" className="flex-1 gap-2 text-slate-700 border-slate-300 bg-white">
                  <Download className="size-4" /> Baixar PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}