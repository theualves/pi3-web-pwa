"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { ValidarAtividadeModal } from "@/components/ValidarAtividadeModal";

export function TabelaAtividadesClient({ dadosIniciais }: { dadosIniciais: any[] }) {
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<any | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const colunas = [
    { header: "Estudante", accessor: "estudante" },
    { header: "Categoria e Carga Horária", accessor: "categoriaCarga" },
    { header: "Período", accessor: "periodo" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" }, // Coluna de ações adicionada aqui
  ];

  const handleAbrirValidacao = (linha: any) => {
    setAtividadeSelecionada(linha);
    setModalAberto(true);
  };

  return (
    <>
      <DataTable 
        columns={colunas} 
        data={dadosIniciais} 
        onViewClick={handleAbrirValidacao} 
      />

      <ValidarAtividadeModal 
        atividade={atividadeSelecionada} 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
      />
    </>
  );
}