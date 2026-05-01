"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput"; // Importando o input que acabamos de criar

export function TabelaUsuarios({ colunas, dadosMockados }: any) {
  // Estado que guarda o que o usuário digitou
  const [termoBusca, setTermoBusca] = useState("");

  // Filtra a lista com base no termo digitado (procura no nome OU no email)
  const usuariosFiltrados = dadosMockados.filter((usuario: any) => {
    const nome = usuario.nome.toLowerCase();
    const email = usuario.email.toLowerCase();
    const busca = termoBusca.toLowerCase();

    return nome.includes(busca) || email.includes(busca);
  });

  return (
    <div className="flex flex-col gap-4">
      
      {/* Barra de Ações: Botão Novo e Busca */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <Button className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 shadow-md w-full sm:w-auto">
          <Plus className="size-4" />
          Novo Usuário
        </Button>

        {/* O nosso componente de busca em ação */}
        <SearchInput 
          value={termoBusca} 
          onChange={setTermoBusca} 
          placeholder="Buscar por nome ou e-mail..." 
        />
      </div>

      {/* Tabela renderizando apenas os usuários filtrados */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <DataTable columns={colunas} data={usuariosFiltrados} />
        
        {/* Aviso caso a busca não encontre ninguém */}
        {usuariosFiltrados.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum usuário encontrado para "{termoBusca}".
          </div>
        )}
      </div>

    </div>
  );
}