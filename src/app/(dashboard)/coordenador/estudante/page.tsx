"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Users, ChevronRight, Loader2, Settings } from "lucide-react";
import { NovaTurmaModal } from "@/components/ModalNovaTurma";
import { GerenciarTurmaModal } from "@/components/GerenciarTurmaModal";
import { IconeSenac } from "@/components/IconeSenac";
import { api } from "@/lib/api";

export default function PaginaEstudantes() {
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalTurmaAberto, setModalTurmaAberto] = useState(false);
  const [modalGerenciarAberto, setModalGerenciarAberto] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);

  const carregarTurmas = async () => {
    try {
      setCarregando(true);

      const storage = localStorage.getItem("usuarioLogado");
      const sessao = storage ? JSON.parse(storage) : null;
      const meuid = sessao?.id;

      if (!meuid) return;

      // 1. Busca o curso do Coordenador
      const resCursos = await api(`/api/cursos?coordenadorId=${meuid}`);
      const cursos = await resCursos.json();

      if (!cursos || cursos.length === 0) {
        setTurmas([]);
        setCarregando(false);
        return;
      }
      const cursoIdDoVitor = cursos[0].id;

      // 2. Busca as Turmas desse curso na API
      const resTurmas = await api(`/api/turmas?cursoId=${cursoIdDoVitor}`);
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

  const handleAbrirGerenciamento = (e: React.MouseEvent, turma: any) => {
    e.preventDefault(); // Impede que o clique no botão ative o <Link>
    setTurmaSelecionada(turma);
    setModalGerenciarAberto(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Turmas do Curso</h1>
        </div>

        <Button
          onClick={() => setModalTurmaAberto(true)}
          className="bg-[#004A8D] hover:bg-[#003666] text-white"
        >
          <Plus className="size-4 mr-2" /> Nova Turma
        </Button>
      </div>

      <NovaTurmaModal
        isOpen={modalTurmaAberto}
        onClose={(sucesso) => {
          setModalTurmaAberto(false);
          if (sucesso) carregarTurmas();
        }}
      />

      <GerenciarTurmaModal
        isOpen={modalGerenciarAberto}
        turma={turmaSelecionada}
        onClose={(sucesso) => {
          setModalGerenciarAberto(false);
          setTurmaSelecionada(null);
          if (sucesso) carregarTurmas();
        }}
      />

      {carregando ? (
        <div className="flex justify-center p-12">
          <Loader2 className="size-8 animate-spin text-slate-400" />
        </div>
      ) : turmas.length === 0 ? (
        <div className="text-center p-12 bg-white border border-slate-200 rounded-lg shadow-sm">
          <Users className="size-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700">
            Nenhuma turma cadastrada
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Crie a primeira turma para começar a adicionar estudantes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {turmas.map((turma: any, index: number) => {
            const coresTeams = [
              "bg-[#4F46E5]", // Azul vibrante
              "bg-[#F97316]", // Laranja vibrante
              "bg-[#22C55E]", // Verde vibrante
              "bg-[#A855F7]", // Roxo vibrante
              "bg-[#14B8A6]", // Teal vibrante
              "bg-[#EC4899]", // Magenta vibrante
            ];
            const corFundo = coresTeams[index % coresTeams.length];

            return (
              <Link
                key={turma.id}
                href={`/coordenador/estudante/turma/${turma.id}`}
                className="group"
              >
                <div className="bg-white py-8 px-6 min-h-[170px] rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#004A8D] transition-all flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-5 min-w-0 flex-1 pr-6">
                    <div
                      className={`${corFundo} rounded shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 w-[56px] h-[56px] md:w-[64px] md:h-[64px]`}
                    >
                      <IconeSenac
                        branca
                        style={{ width: "34px", height: "24px" }}
                        className="text-white"
                      />
                    </div>

                    <div className="flex flex-col justify-center min-w-0 flex-1">
                      <h2
                        className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-[#004A8D] transition-colors leading-tight"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        {turma.nome}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {turma._count?.alunos || 0} estudantes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-[72px] justify-end">
                    <button
                      onClick={(e) => handleAbrirGerenciamento(e, turma)}
                      className="p-2 text-slate-400 hover:text-[#004A8D] hover:bg-slate-100 rounded-full transition-colors"
                      title="Gerenciar Turma"
                    >
                      <Settings className="size-5" />
                    </button>
                    <ChevronRight className="size-5 text-slate-300 group-hover:text-[#004A8D] transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
