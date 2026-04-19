import { DataTable } from "@/components/DataTable";
import { buscarAtividadesRecentes } from "@/services/atividadesService";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Atividades enviadas
          </h1>
        </div>
        {/* Espaço reservado para um futuro botão de "Nova Atividade" ou "Exportar" */}
        <div className="flex gap-4">
          <Button variant="outline">
            <Link href="/login">Buscar uma atividade</Link>
          </Button>

          <Button variant="outline">
            <Link href="/login">Validar uma atividade</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <DataTable columns={colunas} data={dadosFormatados} />
      </div>
    </div>
  );
}
