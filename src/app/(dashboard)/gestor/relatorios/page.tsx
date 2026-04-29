import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { buscarDadosRelatorio } from "@/services/relatorioService";

export default async function RelatoriosPage() {
  const stats = await buscarDadosRelatorio();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Coordenadores"
          value={stats.totalCoordenadores}
          icon={Users}
          bgClass=""
          description="+12 novos este mês"
        />

        <KpiCard
          title="Novos esse mês"
          value={`${stats.novosUsuariosMes}%`}
          icon={CheckCircle2}
          bgClass=""
          description="+8% em relação ao mês anterior"
        />

        <KpiCard
          title="Inativos"
          value={`${stats.usuariosInativos}%`}
          icon={AlertTriangle}
          bgClass=""
          description="-5% em relação ao mês anterior"
        />
      </div>
    </div>
  );
}
