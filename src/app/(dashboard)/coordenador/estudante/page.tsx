"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Users, ChevronRight, Loader2 } from "lucide-react";

export default function PaginaEstudantes() {
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarTurmas = async () => {
    try {
      setCarregando(true);
      
      const storage = localStorage.getItem("usuarioLogado");
      const sessao = storage ? JSON.parse(storage) : null;
      const meuid = sessao?.id;

      if (!meuid) return;

      // 1. Busca o curso do Coordenador
      const resCursos = await fetch(`https://api-horas-complementares.onrender.com/api/cursos?coordenadorId=${meuid}`);
      const cursos = await resCursos.json();

      if (!cursos || cursos.length === 0) return;
      const cursoIdDoVitor = cursos[0].id;

      // 2. Busca as Turmas desse curso na API
      const resTurmas = await fetch(`https://api-horas-complementares.onrender.com/api/turmas?cursoId=${cursoIdDoVitor}`);
      const dadosTurmas = await resTurmas.json();
      
      setTurmas(dadosTurmas);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Turmas do Curso</h1>
          <p className="text-sm text-slate-500">Selecione uma turma para gerenciar os estudantes.</p>
        </div>
        <Button className="bg-[#004A8D] hover:bg-[#003666] text-white">
          <Plus className="size-4 mr-2" /> Nova Turma
        </Button>
      </div>

      {carregando ? (
        <div className="flex justify-center p-12">
          <Loader2 className="size-8 animate-spin text-slate-400" />
        </div>
      ) : turmas.length === 0 ? (
        <div className="text-center p-12 bg-white border border-slate-200 rounded-lg shadow-sm">
          <Users className="size-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700">Nenhuma turma cadastrada</h3>
          <p className="text-slate-500 text-sm mt-1">Crie a primeira turma para começar a adicionar estudantes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {turmas.map((turma: any) => (
            <Link 
              key={turma.id} 
              href={`/coordenador/estudante/turma/${turma.id}`}
              className="group"
            >
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-[#004A8D] transition-all flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-md group-hover:bg-[#004A8D]/10 transition-colors">
                    <Users className="size-6 text-[#004A8D]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-[#004A8D] transition-colors">
                      {turma.nome}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {turma._count?.alunos || 0} estudantes
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-slate-300 group-hover:text-[#004A8D] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}