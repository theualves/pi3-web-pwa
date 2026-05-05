import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { buscarDadosRelatorio } from "@/services/relatorioService";
import { DataTable } from "@/components/DataTable";

export default async function GestorDashboard() {
  const stats = await buscarDadosRelatorio();

  const relatoriosPorCoordenador = [
    { id: "1", nome: "Filipe", quantidade: 4 },
    { id: "2", nome: "Ana Souza", quantidade: 2 },
    { id: "3", nome: "Prof. Marcos", quantidade: 1 },
    { id: "4", nome: "Matheus Silva", quantidade: 1 },
  ];

  const colunasEngajamento = [
    { header: "Curso", accessor: "curso" },
    { header: "Alunos", accessor: "alunos" },
    { header: "Entregas (%)", accessor: "entregas" },
    { header: "Status", accessor: "status" },
  ];

  const cursosEngajadosMock = [
    {
      id: "1",
      curso: "Eng. de Software",
      alunos: 120,
      entregas: "92%",
      status: "Excelente",
    },
    {
      id: "2",
      curso: "Design Gráfico",
      alunos: 85,
      entregas: "88%",
      status: "Excelente",
    },
    {
      id: "3",
      curso: "Administração",
      alunos: 210,
      entregas: "65%",
      status: "Atenção",
    },
    {
      id: "4",
      curso: "Nutrição",
      alunos: 60,
      entregas: "40%",
      status: "Crítico",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Coordenadores"
          value={stats.totalCoordenadores}
          icon={Users}
          bgClass="bg-[#21598E]"
          description="+12 novos este mês"
        />
        <KpiCard
          title="Novos esse mês"
          value={`${stats.novosUsuariosMes}%`}
          icon={CheckCircle2}
          bgClass="bg-[#DA761F]"
          description="+8% em relação ao mês anterior"
        />
        <KpiCard
          title="Inativos"
          value={`${stats.usuariosInativos}%`}
          icon={AlertTriangle}
          bgClass="bg-[#210367]"
          description="-5% em relação ao mês anterior"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Relatórios por Coordenador
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {relatoriosPorCoordenador.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-slate-50 rounded-md border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                <span className="font-medium text-slate-700">{item.nome}</span>

                <span className="bg-[#004A8D] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {item.quantidade}{" "}
                  {item.quantidade === 1 ? "relatório" : "relatórios"}
                </span>
              </div>
            ))}
          </div>

          {relatoriosPorCoordenador.length === 0 && (
            <p className="text-center text-slate-500 py-4">
              Nenhum relatório enviado recentemente.
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-center border-dashed">
          <p className="text-slate-400 text-sm">Vai Corinthians!</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden border border-slate-100 rounded-md my-8">
        <DataTable columns={colunasEngajamento} data={cursosEngajadosMock} />
      </div>
    </div>
  );
}
