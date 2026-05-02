import { buscarEstudantes } from "@/services/estudanteService";
import { TabelaEstudantes } from "@/components/TabelaEstudantes";

export default async function EstudantePage() {
  const estudantes = await buscarEstudantes();

  const colunas = [
    { header: "Nome", accessor: "nome" },
    { header: "CPF", accessor: "cpf" },
    { header: "Período", accessor: "periodo" },
    { header: "Horas Registradas", accessor: "horasRegistradas" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  return (
    <div className="">
      <TabelaEstudantes estudantes={estudantes} colunas={colunas} />
    </div>
  );
}