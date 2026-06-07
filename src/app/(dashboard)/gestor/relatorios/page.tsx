"use client";

import { useState, useEffect } from "react";
import { KpiCard } from "@/components/KpiCard";
import { FileText, CheckCircle2, XCircle, Loader2, Filter } from "lucide-react";
import { CardRelatorio } from "@/components/CardRelatorio";
import { api } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RelatoriosPage() {
  const [relatoriosReais, setRelatoriosReais] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [cursoSelecionado, setCursoSelecionado] = useState<string>("TODOS");
  const [carregando, setCarregando] = useState(true);
  const [cardAbertoId, setCardAbertoId] = useState<string | null>(null);

  // 1. Busca a lista de cursos APENAS UMA VEZ ao abrir a tela
  useEffect(() => {
    const carregarCursos = async () => {
      try {
        const res = await api("/api/cursos");
        if (res.ok) {
          const dadosCursos = await res.json();
          // Ajuste dependendo de como seu backend retorna (ex: dadosCursos.cursos ou direto o array)
          setCursos(Array.isArray(dadosCursos) ? dadosCursos : dadosCursos.cursos || []);
        }
      } catch (error) {
        console.error("Erro ao carregar lista de cursos:", error);
      }
    };
    carregarCursos();
  }, []);

  // 2. Busca os relatórios SEMPRE que o cursoSelecionado mudar
  useEffect(() => {
    const carregarRelatorios = async () => {
      setCarregando(true);
      try {
        // Monta a URL dinamicamente. Se for "TODOS", não passa o cursoId.
        let url = "/api/atividades?processadas=true";
        if (cursoSelecionado !== "TODOS") {
          url += `&cursoId=${cursoSelecionado}`;
        }

        const res = await api(url);
        
        if (res.ok) {
          const dadosApi = await res.json();
          setRelatoriosReais(Array.isArray(dadosApi) ? dadosApi : dadosApi.atividades || []);
        } else {
          console.error("Backend recusou a busca das atividades.");
        }
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarRelatorios();
  }, [cursoSelecionado]); // 👉 O segredo da reatividade está aqui!

  // Cálculos dinâmicos baseados no que a API retornou para o curso selecionado
  const totalAvaliadas = relatoriosReais.length;
  const totalAprovadas = relatoriosReais.filter((r) => r.status === "APROVADA").length;
  const totalRejeitadas = relatoriosReais.filter((r) => r.status === "REJEITADA").length;

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6">
      
      {/* 👉 CABEÇALHO COM FILTRO MACRO (Visão de Gestor) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Auditoria e Relatórios</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visão global de atividades já processadas pelos coordenadores.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-100 p-2 rounded-md text-slate-500 hidden md:block">
            <Filter className="size-5" />
          </div>
          <div className="w-full md:w-[280px]">
            <Select value={cursoSelecionado} onValueChange={setCursoSelecionado}>
              <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Filtrar por curso..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS" className="font-semibold text-[#004A8D]">
                  Todos os Cursos (Visão Geral)
                </SelectItem>
                {cursos.map((curso: any) => (
                  <SelectItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Avaliadas"
          value={totalAvaliadas.toString()}
          icon={FileText}
          bgClass=""
          description={cursoSelecionado === "TODOS" ? "Na instituição inteira" : "Neste curso específico"}
        />
        <KpiCard
          title="Aprovadas"
          value={totalAprovadas.toString()}
          icon={CheckCircle2}
          bgClass=""
          description="Horas validadas"
        />
        <KpiCard
          title="Rejeitadas"
          value={totalRejeitadas.toString()}
          icon={XCircle}
          bgClass=""
          description="Devolvidas ao aluno"
        />
      </div>

      <div className="mt-2">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-lg font-bold text-slate-800">
            Registro de Validações
          </h2>
          {!carregando && (
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {totalAvaliadas} registros encontrados
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {carregando ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-[#004A8D] mb-4" />
              <p className="font-medium text-slate-500">Filtrando atividades...</p>
            </div>
          ) : relatoriosReais.length > 0 ? (
            relatoriosReais.map((relatorio: any) => (
              <CardRelatorio
                key={relatorio.id}
                relatorio={relatorio}
                isExpanded={cardAbertoId === relatorio.id}
                onToggle={() => setCardAbertoId(cardAbertoId === relatorio.id ? null : relatorio.id)}
              />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
              <div className="bg-slate-100 p-4 rounded-full mb-3">
                <FileText className="size-8 text-slate-400" />
              </div>
              <p className="font-bold text-slate-700 text-lg">Nenhum registro encontrado</p>
              <p className="text-slate-500 text-sm mt-1">
                {cursoSelecionado === "TODOS" 
                  ? "Ainda não existem atividades processadas no sistema."
                  : "Nenhuma atividade foi processada para este curso."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}