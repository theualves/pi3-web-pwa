import { KpiCard } from "@/components/KpiCard"; 
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { buscarDadosRelatorio } from "@/services/relatorioService";
import { CardRelatorio } from "@/components/CardRelatorio"; 

export default async function RelatoriosPage() {
  const stats = await buscarDadosRelatorio();

  const relatoriosMock = [
    {
      id: "1",
      nomeCoordenador: "Matheus Silva",
      curso: "Engenharia de Software",
      dataEnvio: "15 de Mai. 2026",
      descricao: "Relatório semestral contendo o rendimento das turmas de algoritmos, evasão de alunos e métricas de engajamento nas atividades extracurriculares.",
    },
    {
      id: "2",
      nomeCoordenador: "Ana Souza",
      curso: "Administração",
      dataEnvio: "12 de Mai. 2026",
      descricao: "Análise de desempenho dos alunos no projeto integrador. Inclui também as solicitações de novos equipamentos para os laboratórios.",
    },
    {
      id: "3",
      nomeCoordenador: "Prof. Marcos",
      curso: "Design Gráfico",
      dataEnvio: "10 de Mai. 2026",
      descricao: "Acompanhamento das horas complementares e status de conclusão dos trabalhos de conclusão de curso (TCC).",
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard de Relatórios</h1>
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

      <div className="mt-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Últimos Relatórios Enviados
        </h2>
        <div className="flex flex-col gap-2">
          {relatoriosMock.map((relatorio) => (
            <CardRelatorio key={relatorio.id} relatorio={relatorio} />
          ))}
        </div>
      </div>
    </div>
  );
}