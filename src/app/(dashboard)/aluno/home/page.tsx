import { Suspense } from "react";
import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { BotaoNovaAtividade } from "@/components/BotaoNovaAtividade";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

export default function AlunoHome() {
  // ATENÇÃO: Aqui você deve pegar o ID do aluno logado vindo do seu sistema de Auth (NextAuth, Cookies, etc).
  // Para testar agora, coloque o ID real que você usou no Postman (ex: "1" ou o UUID do Rodrigo Garro).
  const usuarioId = "78fc3386-928b-49be-8ae8-0aa0294e329b";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, aluno!</h1>
        </div>
        <BotaoNovaAtividade />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        {/* Passamos o ID do usuário como prop para o componente que faz o fetch */}
        <EstatisticasAsync usuarioId={usuarioId} />
      </Suspense>
    </div>
  );
}

async function EstatisticasAsync({ usuarioId }: { usuarioId: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-horas-complementares.onrender.com';
  
  const response = await fetch(`${apiUrl}/api/aluno-portal/${usuarioId}/dashboard`, {
    cache: 'no-store' 
  });

  if (!response.ok) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">Erro ao carregar estatísticas do painel. Verifique sua conexão com o banco.</div>;
  }

  // 2. Extrai os dados baseados no seu JSON real
  const dadosDashboard = await response.json();
  const { cards, progresso } = dadosDashboard;

  // 3. Calcula a porcentagem que falta para a barra
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
          <h2 className="text-lg font-bold text-slate-800">
            Meu Progresso
          </h2>
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
            <p className="text-2xl font-bold text-amber-500">{percentualPendente}%</p>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Ainda pendentes
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-4 flex overflow-hidden shadow-inner">
          <div
            className="bg-[#004A8D] h-full transition-all duration-1000 ease-out"
            style={{ width: `${progresso.percentual}%` }}
          ></div>
          <div className="h-full" style={{ width: `${percentualPendente}%` }}></div>
        </div>

        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <span>0h</span>
          <span>Meta: {progresso.limiteHoras}h</span>
        </div>
      </div>
    </>
  );
}