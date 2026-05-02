import { KpiCard } from "@/components/KpiCard";
import { buscarDadosRelatorio } from "@/services/relatorioService";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { GraficoAtividades } from "@/components/GraficoAtividades";
import { CalendarDays, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default async function RelatoriosCoordenador() {
  const stats = await buscarDadosRelatorio();

  const alunosEnviaram = 78;
  const alunosFaltam = 100 - alunosEnviaram;

  return (
    <div className="flex flex-col gap-6">
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
            Progresso de Envio de Atividades (Semestre Atual)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoAtividades />

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="size-5 text-[#004A8D]" />
            <h2 className="text-lg font-bold text-slate-800">
              Comparativo Semestral
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Taxa de Envio Geral
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-800">
                    78%
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    em 2026.1
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 text-right">
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold w-fit sm:ml-auto">
                  <ArrowUpRight className="size-4" />
                  +13%
                </div>
                <p className="text-xs text-slate-400 mt-1">vs. 65% em 2025.2</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  Adesão à Extensão
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-800">
                    42%
                  </span>
                  <span className="text-sm text-slate-500 font-medium">
                    em 2026.1
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 text-right">
                <div className="flex items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-bold w-fit sm:ml-auto">
                  <ArrowDownRight className="size-4" />
                  -5%
                </div>
                <p className="text-xs text-slate-400 mt-1">vs. 47% em 2025.2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
