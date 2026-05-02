"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { NovoEstudanteModal } from "@/components/NovoEstudanteModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

export function TabelaEstudantes({ estudantes, colunas }: any) {
  const [modalAberto, setModalAberto] = useState(false);

  const [termoBusca, setTermoBusca] = useState("");

  const estudantesFiltrados =
    estudantes?.filter((estudante: any) => {
      const nome = estudante.nome?.toLowerCase() || "";
      const cpf = estudante.cpf?.toLowerCase() || "";
      const busca = termoBusca.toLowerCase();

      return nome.includes(busca) || cpf.includes(busca);
    }) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Estudantes</h1>
        </div>

        {/* Agrupamos o botão e a barra de busca lado a lado */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <SearchInput
            value={termoBusca}
            onChange={setTermoBusca}
            placeholder="Buscar por nome ou CPF..."
          />
          <Button
            onClick={() => setModalAberto(true)}
            className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 shadow-md w-full sm:w-auto"
          >
            <Plus className="size-4" />
            Novo Estudante
          </Button>
        </div>

        <NovoEstudanteModal
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <DataTable columns={colunas} data={estudantesFiltrados} />
        {estudantesFiltrados.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum estudante encontrado para "{termoBusca}".
          </div>
        )}
      </div>
    </div>
  );
}
