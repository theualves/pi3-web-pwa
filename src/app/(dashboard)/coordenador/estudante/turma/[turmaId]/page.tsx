import { buscarEstudantes } from "@/services/estudanteService";
import { TabelaEstudantes } from "@/components/TabelaEstudantes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// 1. Tipamos o params como uma Promise
export default async function PaginaDaTurma(props: { params: Promise<{ turmaId: string }> }) {
  
  // 2. Colocamos o 'await' para o Next.js extrair os dados da URL corretamente
  const params = await props.params;
  const idDaTurma = params.turmaId;

  // 3. Agora o ID real vai para o service, e o filtro vai funcionar!
  const estudantes = await buscarEstudantes({ turmaId: idDaTurma });

  const colunas = [
    { header: "Nome", accessor: "nome" },
    { header: "CPF", accessor: "cpf" },
    { header: "Período", accessor: "periodo" },
    { header: "Carga Exigida", accessor: "horasRegistradas" }, 
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link 
          href="/coordenador/estudante" 
          className="flex items-center text-sm text-slate-500 hover:text-[#004A8D] transition-colors w-fit"
        >
          <ArrowLeft className="size-4 mr-1" />
          Voltar para Turmas
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Estudantes da Turma</h1>
      </div>

      <div className="">
        <TabelaEstudantes estudantes={estudantes} colunas={colunas} />
      </div>
    </div>
  );
}