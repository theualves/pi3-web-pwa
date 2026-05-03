"use client";

import { DataTable, Column } from "@/components/DataTable"; 

export default function AlunoSolicitacoes() {

  const columns: Column[] = [
    { header: "Atividades Enviadas", accessor: "nome" },
    { header: "Data de Envio", accessor: "dataEnvio" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  const dadosSimulados = [
    {
      id: 1,
      nome: "Curso de Introdução ao React",
      dataEnvio: "15/04/2024",
      status: "Aprovado",
    },
    {
      id: 2,
      nome: "Palestra sobre Cibersegurança",
      dataEnvio: "20/04/2024",
      status: "Pendente",
    },
    {
      id: 3,
      nome: "Certificado de Horas Extracurriculares",
      dataEnvio: "22/04/2024",
      status: "Recusado", 
    },
  ];

  const handleEditar = (row: any) => {
    console.log("Editando atividade recusada:", row.nome);
  };

  const handleExcluir = (row: any) => {
    console.log("Excluindo atividade:", row.nome);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#004A8D]">
            Minhas Solicitações
          </h1>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={dadosSimulados}
        onEditClick={handleEditar}
        onDeleteClick={handleExcluir}
      />
    </div>
  );
}