"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";

export function TabelaUsuarios({ colunas, dadosMockados }: any) {
  const [termoBusca, setTermoBusca] = useState("");

  // Blindagem adicionada: Garante que é um array e protege o toLowerCase
  const listaSegura = Array.isArray(dadosMockados) ? dadosMockados : [];
  
  const usuariosFiltrados = listaSegura.filter((usuario: any) => {
    const nome = usuario.nome || "";
    const email = usuario.email || "";
    const busca = termoBusca.toLowerCase();

    return nome.toLowerCase().includes(busca) || email.toLowerCase().includes(busca);
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <Button className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 shadow-md w-full sm:w-auto">
          <Plus className="size-4" />
          Novo Usuário
        </Button>

        <SearchInput 
          value={termoBusca} 
          onChange={setTermoBusca} 
          placeholder="Buscar por nome ou e-mail..." 
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <DataTable columns={colunas} data={usuariosFiltrados} />
        
        {usuariosFiltrados.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum usuário encontrado para "{termoBusca}".
          </div>
        )}
      </div>
    </div>
  );
}