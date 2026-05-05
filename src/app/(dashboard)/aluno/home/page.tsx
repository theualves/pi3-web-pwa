import { Suspense } from "react";
import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { buscarDadosRelatorio } from "@/services/relatorioService";
import { BotaoNovaAtividade } from "@/components/BotaoNovaAtividade";

import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

export default function AlunoHome() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, pobre!</h1>
        </div>
        <BotaoNovaAtividade />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <EstatisticasAsync />
      </Suspense>
    </div>
  );
}

async function EstatisticasAsync() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const stats = await buscarDadosRelatorio();
  const alunosEnviaram = 78;
  const alunosFaltam = 100 - alunosEnviaram;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Horas aprovadas"
          value={stats.totalCoordenadores}
          icon={Users}
          bgClass="bg-[#18B14E]"
          description="+12 novos este mês"
        />
        <KpiCard
          title="Horas em análise"
          value={`${stats.novosUsuariosMes}%`}
          icon={CheckCircle2}
          bgClass="bg-[#F28322]"
          description="+8% em relação ao mês anterior"
        />
        <KpiCard
          title="Horas rejeitadas"
          value={`${stats.usuariosInativos}%`}
          icon={AlertTriangle}
          bgClass="bg-[#E52121]"
          description="-5% em relação ao mês anterior"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-bold text-slate-800">Barra de progresso</h2>
        </div>

        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-4xl font-extrabold text-[#004A8D]">{alunosEnviaram}%</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Alunos enviaram as atividades</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-500">{alunosFaltam}%</p>
            <p className="text-sm font-medium text-slate-400 mt-1">Ainda pendentes</p>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden shadow-inner">
          <div
            className="bg-[#004A8D] h-full transition-all duration-1000 ease-out"
            style={{ width: `${alunosEnviaram}%` }}
          ></div>
          <div
            className="h-full"
            style={{ width: `${alunosFaltam}%` }}
          ></div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>Meta: 100%</span>
        </div>
      </div>
    </>
  );
}