"use client";

import { useState, useEffect } from "react";
import { KpiCard } from "@/components/KpiCard";
import { FileText, CheckCircle2, AlertTriangle, Loader2, Check, X, BookOpen, Search, Network } from "lucide-react";
import { api } from "@/lib/api";

export default function RelatoriosCoordenador() {
  const [carregando, setCarregando] = useState(true);
  const [metricas, setMetricas] = useState({
    totalSolicitacoes: 0,
    horasAprovadas: 0,
    pendentes: 0,
    taxaResolucao: 0,
    taxaAprovacao: 0,
    taxaRejeicao: 0,
    horasEnsino: 0,
    horasPesquisa: 0,
    horasExtensao: 0,
    totalHorasValidadas: 0
  });

  useEffect(() => {
    const carregarRelatorios = async () => {
      setCarregando(true);
      try {
        const res = await api("/api/atividades");
        
        if (!res.ok) throw new Error("Erro ao carregar dados");
        
        const dados = await res.json();
        const atividades = Array.isArray(dados) ? dados : dados.atividades || [];

        const aprovadas = atividades.filter((a: any) => a.status === "APROVADA");
        const rejeitadas = atividades.filter((a: any) => a.status === "REJEITADA");
        const pendentes = atividades.filter((a: any) => a.status === "PENDENTE");

        const horasTotal = aprovadas.reduce((acc: number, a: any) => acc + (a.horasAprovadas || 0), 0);
        const processadas = aprovadas.length + rejeitadas.length;
        const total = atividades.length;

        // Distribuição de Horas
        const hEnsino = aprovadas.filter((a: any) => a.categoria === "ENSINO").reduce((acc: number, a: any) => acc + (a.horasAprovadas || 0), 0);
        const hPesquisa = aprovadas.filter((a: any) => a.categoria === "PESQUISA").reduce((acc: number, a: any) => acc + (a.horasAprovadas || 0), 0);
        const hExtensao = aprovadas.filter((a: any) => a.categoria === "EXTENSAO").reduce((acc: number, a: any) => acc + (a.horasAprovadas || 0), 0);

        setMetricas({
          totalSolicitacoes: total,
          horasAprovadas: horasTotal,
          pendentes: pendentes.length,
          taxaResolucao: total > 0 ? Math.round((processadas / total) * 100) : 0,
          taxaAprovacao: processadas > 0 ? Math.round((aprovadas.length / processadas) * 100) : 0,
          taxaRejeicao: processadas > 0 ? Math.round((rejeitadas.length / processadas) * 100) : 0,
          horasEnsino: hEnsino,
          horasPesquisa: hPesquisa,
          horasExtensao: hExtensao,
          totalHorasValidadas: horasTotal || 1 // Evita divisão por zero nos gráficos
        });

      } catch (error) {
        console.error("Erro ao montar relatórios do coordenador:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarRelatorios();
  }, []);

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-[#004A8D]">
        <Loader2 className="size-10 animate-spin mb-4" />
        <p className="font-medium text-lg">Analisando base de relatórios...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full overflow-x-hidden">
      
      {/* Título solto, respeitando a identidade */}
      <h1 className="text-2xl font-bold text-slate-800">
        Relatórios e Desempenho
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Submetidas"
          value={metricas.totalSolicitacoes.toString()}
          icon={FileText}
          bgClass="bg-[#004A8D]"
          description="Atividades recebidas"
        />
        <KpiCard
          title="Horas Aprovadas"
          value={metricas.horasAprovadas.toString()}
          icon={CheckCircle2}
          bgClass="bg-[#18B14E]"
          description="Validadas com sucesso"
        />
        <KpiCard
          title="Fila Pendente"
          value={metricas.pendentes.toString()}
          icon={AlertTriangle}
          bgClass={metricas.pendentes > 0 ? "bg-[#E52121]" : "bg-slate-400"}
          description="Aguardando sua análise"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Termômetro da Fila de Trabalho
          </h2>
        </div>

        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-4xl font-extrabold text-[#004A8D]">
              {metricas.taxaResolucao}%
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Atividades já processadas
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-500">{100 - metricas.taxaResolucao}%</p>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Ainda pendentes
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden shadow-inner">
          <div
            className="bg-[#004A8D] h-full transition-all duration-1000 ease-out"
            style={{ width: `${metricas.taxaResolucao}%` }}
            title={`${metricas.taxaResolucao}% Processadas`}
          ></div>
          <div
            className="bg-amber-400 h-full transition-all duration-1000 ease-out"
            style={{ width: `${100 - metricas.taxaResolucao}%` }}
            title={`${100 - metricas.taxaResolucao}% Pendentes`}
          ></div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-slate-400 font-medium">
          <span>0%</span>
          <span>Meta de Resolução: 100%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        
        {/* 👉 Novo Gráfico: Distribuição de Horas Aprovadas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col min-w-0">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            Horas Validadas por Pilar
          </h2>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <BookOpen className="size-4 text-[#004A8D]" /> Ensino
                </span>
                <span className="text-sm font-bold text-[#004A8D]">{metricas.horasEnsino}h</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#004A8D] h-full rounded-full" style={{ width: `${(metricas.horasEnsino / metricas.totalHorasValidadas) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Search className="size-4 text-[#DA761F]" /> Pesquisa
                </span>
                <span className="text-sm font-bold text-[#DA761F]">{metricas.horasPesquisa}h</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#DA761F] h-full rounded-full" style={{ width: `${(metricas.horasPesquisa / metricas.totalHorasValidadas) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Network className="size-4 text-[#210367]" /> Extensão
                </span>
                <span className="text-sm font-bold text-[#210367]">{metricas.horasExtensao}h</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-[#210367] h-full rounded-full" style={{ width: `${(metricas.horasExtensao / metricas.totalHorasValidadas) * 100}%` }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* 👉 Novo Bloco: Métricas de Avaliação (Taxas Reais) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Métricas de Avaliação
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Taxa de Aprovação
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-800">
                    {metricas.taxaAprovacao}%
                  </span>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 text-right">
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold w-fit sm:ml-auto">
                  <Check className="size-4" />
                  Aceitas
                </div>
                <p className="text-xs text-slate-400 mt-2">Das atividades processadas</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Taxa de Rejeição / Devolução
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-800">
                    {metricas.taxaRejeicao}%
                  </span>
                </div>
              </div>
              <div className="mt-3 sm:mt-0 text-right">
                <div className="flex items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full text-sm font-bold w-fit sm:ml-auto">
                  <X className="size-4" />
                  Devolvidas
                </div>
                <p className="text-xs text-slate-400 mt-2">Para ajustes do aluno</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}