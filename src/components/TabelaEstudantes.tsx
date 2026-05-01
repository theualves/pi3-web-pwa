"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { NovoEstudanteModal } from "@/components/NovoEstudanteModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TabelaEstudantes({ estudantes, colunas }: any) {
  // O estado fica aqui no cliente!
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Estudantes</h1>
        </div>
        
        {/* AQUI ESTÁ O BOTÃO QUE FALTAVA! */}
        <Button 
          onClick={() => setModalAberto(true)} 
          className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 shadow-md"
        >
          <Plus className="size-4" />
          Novo Estudante
        </Button>

        {/* O modal fica invisível aguardando o estado mudar */}
        <NovoEstudanteModal
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <DataTable columns={colunas} data={estudantes} />
      </div>
    </div>
  );
}