"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { ValidarAtividadeModal } from "@/components/ValidarAtividadeModal";
// 1. Importamos o componente de busca
import { SearchInput } from "@/components/SearchInput";

export function TabelaAtividadesClient({
  dadosIniciais,
}: {
  dadosIniciais: any[];
}) {
  // Estados do Modal
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<any | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  
  // 2. Estado da Busca
  const [termoBusca, setTermoBusca] = useState("");

  const colunas = [
    { header: "Estudante", accessor: "estudante" },
    { header: "Categoria e Carga Horária", accessor: "categoriaCarga" },
    { header: "Período", accessor: "periodo" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  const handleAbrirValidacao = (linha: any) => {
    setAtividadeSelecionada(linha);
    setModalAberto(true);
  };

  // 3. Lógica do filtro (Nome do estudante ou categoria da atividade)
  const atividadesFiltradas = dadosIniciais?.filter((atividade: any) => {
    const estudante = atividade.estudante?.toLowerCase() || "";
    const categoria = atividade.categoriaCarga?.toLowerCase() || "";
    const busca = termoBusca.toLowerCase();

    return estudante.includes(busca) || categoria.includes(busca);
  }) || [];

  return (
    <div className="flex flex-col gap-6">
      
      {/* 4. Cabeçalho Padronizado com Título e Busca */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Atividades Submetidas</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* O SearchInput entra aqui, alinhado à direita no desktop */}
          <SearchInput
            value={termoBusca}
            onChange={setTermoBusca}
            placeholder="Buscar por estudante ou categoria..."
          />
        </div>
      </div>

      {/* 5. Tabela com bordas arredondadas e sombra padrão */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <DataTable
          columns={colunas}
          data={atividadesFiltradas}
          onViewClick={handleAbrirValidacao}
        />

        {/* 6. Mensagem caso a busca não retorne resultados */}
        {atividadesFiltradas.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhuma atividade encontrada para "{termoBusca}".
          </div>
        )}
      </div>

      {/* Modal invisível aguardando o estado mudar */}
      <ValidarAtividadeModal
        atividade={atividadeSelecionada}
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
      />
      
    </div>
  );
}