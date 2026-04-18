import { DataTable } from "@/components/DataTable";
import { buscarAtividadesRecentes } from "@/services/atividadesService";

export default async function AtividadesPage() {
  const atividadesAPI = await buscarAtividadesRecentes();

  const colunas = [
    { header: "Estudante", accessor: "estudante" },
    { header: "Categoria e Carga Horária", accessor: "categoriaCarga" },
    { header: "Período", accessor: "periodo" },
    { header: "Status", accessor: "status" },
  ];

  const dadosFormatados = atividadesAPI.map((atividade) => ({
    estudante: atividade.estudante,
    categoriaCarga: `${atividade.categoria} (${atividade.cargaHoraria}h)`,
    periodo: atividade.periodo,
    status: atividade.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Atividades</h1>
          <p className="text-slate-500">Visualize e administre as horas complementares enviadas.</p>
        </div>
        
        {/* Espaço reservado para um futuro botão de "Nova Atividade" ou "Exportar" */}
      </div>

      {/* Tabela de Atividades */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <DataTable columns={colunas} data={dadosFormatados} />
      </div>
    </div>
  );
}