"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Eye, Calendar, Clock, User, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface CardRelatorioProps {
  relatorio: any;
  // 👉 Novas propriedades para o controle "Sanfona"
  isExpanded: boolean;
  onToggle: () => void;
}

export function CardRelatorio({ relatorio, isExpanded, onToggle }: CardRelatorioProps) {
  const [baixandoArquivo, setBaixandoArquivo] = useState(false);

  const dataFormatada = new Date(relatorio.dataValidacao || relatorio.createdAt).toLocaleDateString("pt-BR");

  const handleVisualizarComprovante = async () => {
    setBaixandoArquivo(true);
    try {
      const res = await api(`/api/atividades/${relatorio.id}/comprovante/download`);

      if (!res.ok) {
        throw new Error("Erro ao carregar o comprovante do servidor.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar o arquivo. Ele pode ter sido removido.");
    } finally {
      setBaixandoArquivo(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all duration-200 hover:shadow-md relative">
      <div
        onClick={onToggle} // 👉 Agora chama a função que vem do pai
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-slate-50 transition-colors gap-4"
      >
        <div className="flex flex-wrap sm:items-center gap-4 w-full md:w-1/2 pr-8 md:pr-0">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 w-full">
            <div className="bg-[#378bf8] p-3 sm:p-4 rounded-full text-[#004A8D] shrink-0 mt-1">
              <FileText className="size-6 sm:size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight line-clamp-2">
                {relatorio.titulo || "Atividade Complementar"}
              </h3>
              
              {relatorio.aluno && (
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 truncate">
                    <User className="size-3.5 sm:size-4 text-slate-400 shrink-0" />
                    <span className="font-medium truncate">{relatorio.aluno.usuario?.nome || "Aluno Desconhecido"}</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <GraduationCap className="size-3.5 sm:size-4 text-slate-400 shrink-0" />
                    <span className="truncate">{relatorio.aluno.curso?.nome || "Curso não informado"}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm w-full md:w-auto mt-2 md:mt-0 ml-[52px] sm:ml-[68px] md:ml-0">
          <div>
            <p className="text-blue-600 font-bold uppercase text-[9px] sm:text-[10px] tracking-wider mb-1">Status</p>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-[10px] sm:text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {relatorio.status === "APROVADA" ? "Aprovada" : relatorio.status}
            </span>
          </div>
          <div>
            <p className="text-blue-600 font-bold uppercase text-[9px] sm:text-[10px] tracking-wider mb-1 flex items-center gap-1">
              Data do Parecer
            </p>
            <p className="font-semibold text-slate-700 text-xs sm:text-sm flex items-center gap-1">
              <Calendar className="size-3 text-slate-400" />
              {dataFormatada}
            </p>
          </div>
        </div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:static flex items-center">
          {isExpanded ? ( // 👉 Usa a prop controlada
            <ChevronUp className="size-5 sm:size-6 text-slate-400" />
          ) : (
            <ChevronDown className="size-5 sm:size-6 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && ( // 👉 Usa a prop controlada para mostrar/esconder
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mb-2">Descrição da Atividade</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-3 md:min-h-[120px] rounded-md border border-slate-200 shadow-sm break-words">
                {relatorio.descricao || "Sem descrição informada pelo estudante."}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mb-2">Detalhes Técnicos</h4>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                   <div className="bg-white p-3 rounded-md border border-slate-200 flex-1 shadow-sm">
                      <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase flex items-center gap-1 mb-1">
                        <Clock className="size-3" /> Horas Aprovadas
                      </p>
                      <p className="text-base sm:text-lg font-bold text-emerald-600">{relatorio.horasAprovadas || 0}h</p>
                   </div>
                   <div className="bg-white p-3 rounded-md border border-slate-200 flex-1 shadow-sm">
                      <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase mb-1">Categoria</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">{relatorio.categoria || "Geral"}</p>
                   </div>
                </div>
              </div>

              <div className="flex pt-2">
                {relatorio.comprovante ? (
                  <Button 
                    onClick={handleVisualizarComprovante}
                    disabled={baixandoArquivo}
                    className="w-full sm:w-auto px-4 sm:px-8 bg-[#004A8D] hover:bg-[#003666] text-white flex gap-2 text-xs sm:text-sm h-10 sm:h-10"
                  >
                    {baixandoArquivo ? <Loader2 className="size-3.5 sm:size-4 animate-spin shrink-0" /> : <Eye className="size-3.5 sm:size-4 shrink-0" />}
                    {baixandoArquivo ? "Carregando..." : "Visualizar Comprovante"}
                  </Button>
                ) : (
                  <Button disabled className="w-full sm:w-auto px-4 sm:px-8 bg-slate-200 text-slate-500 flex gap-2 text-xs sm:text-sm h-10 sm:h-10">
                    <Eye className="size-3.5 sm:size-4 shrink-0" /> Aluno não anexou
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}