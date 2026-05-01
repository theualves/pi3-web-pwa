import { buscarEstudantes } from "@/services/estudanteService";
// Importe o componente que acabamos de criar
import { TabelaEstudantes } from "@/components/TabelaEstudantes";

// Como não tem "use client", podemos usar o async livremente!
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
    <div className="p-8">
      {/* Passamos os dados do servidor para o componente do cliente */}
      <TabelaEstudantes estudantes={estudantes} colunas={colunas} />
    </div>
  );
}