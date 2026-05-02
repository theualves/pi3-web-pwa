import { KpiCard } from "@/components/KpiCard";
import { buscarDadosDashboard } from "@/services/dashboardService";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { DashboardCharts } from "@/components/DashboardCharts";


export default async function HomePage() {
  const stats = await buscarDadosDashboard();

  return (
    <div className="flex flex-col gap-4 pb-10">
      <h1 className="text-2xl font-bold text-gray-900">
        Bem-vindo(a), Coordenador(a)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total de Estudantes"
          value={stats.totalEstudantes}
          icon={Users}
          bgClass="bg-[#F28322]"
          description="+12 novos este mês"
        />

        <KpiCard
          title="Horas Completas"
          value={`${stats.porcentagemCompletas}%`}
          icon={CheckCircle2}
          bgClass="bg-[#F28322]"
          description={`${stats.totalCompletas} alunos finalizaram`}
        />

        <KpiCard
          title="Alunos em Risco"
          value={`${stats.porcentagemRisco}%`}
          icon={AlertTriangle}
          bgClass="bg-[#F28322]"
          description={`${stats.totalRisco} alunos com poucas horas`}
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
