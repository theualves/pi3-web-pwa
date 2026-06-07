"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Clock, BookOpen, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function AlunoCursos() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const carregarCursos = async () => {
      try {
        setCarregando(true);
        const response = await api("/api/aluno-portal/cursos");
        
        if (!response.ok) {
          throw new Error("Erro ao buscar cursos");
        }

        const data = await response.json();
        console.log("📦 DADOS DO CURSO:", data.cursos);
        // O seu backend retorna { total: X, cursos: [...] }
        setCursos(data.cursos || []);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    };

    carregarCursos();
  }, []);

  const getStatusColor = (status: string) => {
    // Normalizando para evitar erros de maiúsculas/minúsculas vindos do banco
    const statusNormalizado = status?.toUpperCase() || "";
    
    switch (statusNormalizado) {
      case "ATIVO":
        return "bg-green-100 text-green-700 border-green-200";
      case "TRANCADO":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "CONCLUÍDO":
      case "CONCLUIDO":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meus Cursos</h1>
      </div>

      {carregando ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="size-8 animate-spin text-[#004A8D]" />
        </div>
      ) : erro ? (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-700 text-center">
          Não foi possível carregar seus cursos no momento. Verifique sua conexão.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mt-2">
            {cursos.map((cursoItem: any, index: number) => {
              // 👉 1. Ajuste da Chave (Resolve o aviso vermelho do React)
              const chaveUnica = cursoItem.matriculaId || cursoItem.cursoId || index;
              
              // 👉 2. Lendo os nomes corretos do seu JSON
              const nomeCurso = cursoItem.nomeCurso || "Curso sem nome";
              
              // Como o turno vem 'null' do banco, colocamos "Não definido" para ficar mais elegante
              const turno = cursoItem.turno || "Não definido"; 
              const status = cursoItem.status || "ATIVO";

              return (
                <div
                  key={chaveUnica} // A chave única corrigida
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#004A8D]"></div>

                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-[#004A8D] shrink-0">
                      <GraduationCap className="size-6" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <h2 className="text-lg font-bold text-slate-800 leading-tight">
                        {nomeCurso}
                      </h2>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="size-4 hidden md:block text-slate-400" />
                        <span className="text-sm font-medium">Turno:</span>
                        <span className="text-sm text-slate-800 font-semibold">
                          {turno}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 md:min-w-fit">
                    <div className="flex items-center gap-2 text-slate-600">
                      <BookOpen className="size-4 text-slate-400 md:hidden" />
                      <span className="text-sm font-medium md:hidden">Situação:</span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {cursos.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
              <GraduationCap className="size-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">
                Nenhum curso encontrado
              </h3>
              <p className="text-slate-500 mt-2">
                Você ainda não está matriculado em nenhum curso.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}