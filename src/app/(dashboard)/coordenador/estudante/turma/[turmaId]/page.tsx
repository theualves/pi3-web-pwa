import { TabelaEstudantes } from "@/components/TabelaEstudantes";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PaginaDaTurma(props: { params: Promise<{ turmaId: string }> }) {
  const params = await props.params;
  const idDaTurma = params.turmaId;

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
          className="flex items-center text-base text-slate-500 hover:text-[#004A8D] transition-colors w-fit"
        >
          <ArrowLeft className="size-4 mr-1" />
          Voltar para Turmas
        </Link>
      </div>

      <div className="">
        {/* Passamos apenas o idDaTurma como prop. A tabela cuida do resto! */}
        <TabelaEstudantes colunas={colunas} turmaId={idDaTurma} />
      </div>
    </div>
  );
}