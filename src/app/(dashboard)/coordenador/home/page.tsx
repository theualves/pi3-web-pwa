import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { DashboardCharts } from "@/components/DashboardCharts";
import { buscarDadosRelatorio } from "@/services/relatorioService";


export default async function HomePage() {
  const stats = await buscarDadosRelatorio();

  const kpis = {
    totalAlunos: 12,
    alunosHoraCompleta: 50,
    alunosEmRisco: 0,
  };

  return (
    <div className="flex flex-col gap-4 pb-10">
      <h1 className="text-2xl font-bold text-gray-900">
        Bem-vindo(a), Coordenador(a)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total de Estudantes"
          value={kpis.totalAlunos}
          icon={Users}
          bgClass="bg-[#F28322]"
          description="+12 novos este mês"
        />

        <KpiCard
          title="% de alunos com horas completas"
          value={`${kpis.alunosHoraCompleta}%`}
          icon={CheckCircle2}
          bgClass="bg-[#F28322]"
          description=""
        />

        <KpiCard
          title="% de alunos em risco(<50%)"
          value={`${kpis.alunosEmRisco}%`}
          icon={AlertTriangle}
          bgClass="bg-[#F28322]"
          description=""
        />
      </div>

      <DashboardCharts
        dadosAtividades={stats.graficoAtividades}
        dadosMeses={stats.graficoMeses}
        dadosStatus={stats.graficoStatus}
      />
    </div>
  );
}
