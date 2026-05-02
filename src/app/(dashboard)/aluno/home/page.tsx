import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import { buscarDadosRelatorio } from "@/services/relatorioService";
import { Button } from "@/components/ui/button";

export default async function AlunoHome() {
  const stats = await buscarDadosRelatorio();

  const alunosEnviaram = 78;
  const alunosFaltam = 100 - alunosEnviaram;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, pobre!</h1>
        </div>
        <Button className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 w-full sm:w-auto">
          <Plus className="size-4" />
          Adicionar nova atividade
        </Button>
      </div>
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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Barra de progresso
          </h2>
        </div>

        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-4xl font-extrabold text-[#004A8D]">
              {alunosEnviaram}%
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Alunos enviaram as atividades
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-500">{alunosFaltam}%</p>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Ainda pendentes
            </p>
          </div>
        </div>

        {/* Barra de Progresso*/}
        <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden shadow-inner">
          <div
            className="bg-[#004A8D] h-full transition-all duration-1000 ease-out"
            style={{ width: `${alunosEnviaram}%` }}
            title={`${alunosEnviaram}% Enviados`}
          ></div>
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${alunosFaltam}%` }}
            title={`${alunosFaltam}% Pendentes`}
          ></div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>Meta: 100%</span>
        </div>
      </div>
    </div>
  );
}
