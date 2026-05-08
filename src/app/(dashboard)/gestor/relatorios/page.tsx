import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle, FileBarChart2 } from "lucide-react";
import { buscarDadosRelatorio } from "@/services/relatorioService";
import { CardRelatorio } from "@/components/CardRelatorio";

async function getAtividadesProcessadas() {
  const res = await fetch("https://api-horas-complementares.onrender.com/api/atividades?processadas=true", {
    cache: "no-store", 
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function RelatoriosPage() {

  const [stats, relatoriosReais] = await Promise.all([
    buscarDadosRelatorio(),
    getAtividadesProcessadas()
  ]);

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard de Relatórios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total de relatórios"
          value={stats.totalCoordenadores}
          icon={Users}
          bgClass=""
          description=""
        />
        <KpiCard
          title="Aprovados"
          value={`${stats.novosUsuariosMes}%`}
          icon={CheckCircle2}
          bgClass=""
          description=""
        />
        <KpiCard
          title="pendentes"
          value={`${stats.usuariosInativos}`}
          icon={AlertTriangle}
          bgClass=""
          description=""
        />
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Últimos Relatórios Enviados
          </h2>
          <span className="text-sm text-slate-500">
            Total: {relatoriosReais.length} registros
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {relatoriosReais.length > 0 ? (
            relatoriosReais.map((relatorio: any) => (
              <CardRelatorio key={relatorio.id} relatorio={relatorio} />
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400">Nenhuma atividade processada encontrada no banco.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}