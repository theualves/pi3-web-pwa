"use client";

import { useState, useEffect } from "react";
import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { BotaoNovaAtividade } from "@/components/BotaoNovaAtividade";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { api } from "@/lib/api"; // 👉 Importamos a nossa api.js blindada

export default function AlunoHome() {
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [nomeAluno, setNomeAluno] = useState("aluno");

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        const usuarioStorage = localStorage.getItem("usuarioLogado");
        if (usuarioStorage) {
          const usuario = JSON.parse(usuarioStorage);
          setNomeAluno(usuario.nome || "aluno");
        }

        const response = await api("/api/aluno-portal/dashboard");

        if (!response.ok) throw new Error("Erro ao buscar dados");

        const data = await response.json();
        setDados(data);
      } catch (err) {
        console.error(err);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    };

    carregarDashboard();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Olá, {nomeAluno}!
          </h1>
        </div>
        <BotaoNovaAtividade />
      </div>

      {/* Controle de Estados: Carregando, Erro ou Tela Pronta */}
      {carregando ? (
        <DashboardSkeleton />
      ) : erro || !dados ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">
          Erro ao carregar estatísticas do painel. Verifique sua conexão com o
          banco.
        </div>
      ) : (
        <EstatisticasDashboard dados={dados} />
      )}
    </div>
  );
}

// 👉 Componente que renderiza os dados reais
function EstatisticasDashboard({ dados }: { dados: any }) {
  const { cards, progresso } = dados;
  const percentualPendente = 100 - progresso.percentual;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Horas aprovadas"
          value={`${cards.horasAprovadas}h`}
          icon={Users}
          bgClass="bg-[#18B14E]"
          description=""
        />
        <KpiCard
          title="Horas em análise"
          value={`${cards.horasEmAnalise}h`}
          icon={CheckCircle2}
          bgClass="bg-[#F28322]"
          description=""
        />
        <KpiCard
          title="Horas rejeitadas"
          value={`${cards.horasRejeitadas}h`}
          icon={AlertTriangle}
          bgClass="bg-[#E52121]"
          description=""
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-bold text-slate-800">Meu Progresso</h2>
        </div>

        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-4xl font-extrabold text-[#004A8D]">
              {progresso.percentual}%
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Horas concluídas
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-500">
              {percentualPendente}%
            </p>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Ainda pendentes
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden shadow-inner">
          <div
            className="bg-[#004A8D] h-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(progresso.percentual, 100)}%` }}
          ></div>
          <div
            className="h-full"
            style={{ width: `${percentualPendente}%` }}
          ></div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>0h</span>
          <span>Meta: {progresso.limiteHoras}h</span>
        </div>
      </div>
    </>
  );
}
