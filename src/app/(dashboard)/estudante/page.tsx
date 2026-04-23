import { DataTable } from "@/components/DataTable";
import { buscarEstudantes } from "@/services/estudanteService";
import { Button } from "@/components/ui/button";

export default async function EstudantePage() {
  const estudantes = await buscarEstudantes();

  const colunas = [
    { header: "Nome", accessor: "nome" },
    { header: "CPF", accessor: "cpf" },
    { header: "Período", accessor: "periodo" },
    { header: "Horas Registradas", accessor: "horasRegistradas" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" }, // Coluna especial
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Estudantes</h1>
        </div>
        <Button variant="senac" className="gap-2">
          Novo Estudante
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <DataTable columns={colunas} data={estudantes} />
      </div>
    </div>
  );
}