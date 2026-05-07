"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Plus, Pencil, Trash2 } from "lucide-react"; // Importamos os ícones
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { ModalCriarCoordenador } from "@/components/ModalCriarCoordenador";

export function TabelaUsuarios({ colunas }: any) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);

  // 1. Função para carregar os dados do banco
  const carregarCoordenadores = async () => {
    setCarregando(true);
    try {
      const response = await fetch(
        "https://api-horas-complementares.onrender.com/api/usuarios?tipo=COORDENADOR",
      );
      if (!response.ok) throw new Error("Erro ao buscar coordenadores.");

      const data = await response.json();

      // Formata os dados para a tabela conseguir ler (curso e botões)
      const dadosFormatados = data.map((usuario: any) => ({
        ...usuario,
        cursoNome: usuario.curso?.nome || "Não vinculado",
        // Passamos as ações como parte do objeto para o DataTable renderizar,
        // ou deixamos o DataTable criar baseado nos IDs.
      }));

      setUsuarios(dadosFormatados);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCoordenadores();
  }, []);

  // 2. Lógica para DELETAR (usando a rota que você passou)
  const handleExcluir = async (id: string, nome: string) => {
    const confirmou = confirm(
      `Tem certeza que deseja excluir o coordenador ${nome}?`,
    );

    if (confirmou) {
      try {
        const response = await fetch(
          `https://api-horas-complementares.onrender.com/api/usuarios/${id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          // Remove da lista local para a interface atualizar instantaneamente
          setUsuarios((prev) => prev.filter((user) => user.id !== id));
          alert("Coordenador removido com sucesso!");
        } else {
          alert("Erro ao excluir o coordenador no servidor.");
        }
      } catch (error) {
        alert("Erro de conexão ao tentar excluir.");
      }
    }
  };

  // 3. Lógica para EDITAR (Skeleton)
  const handleEditar = (usuario: any) => {
    // Aqui você integraria com o seu modal de edição
    alert(`Editando coordenador: ${usuario.nome}`);
  };

  // 4. Filtro de busca
  const usuariosFiltrados = usuarios.filter((usuario: any) => {
    const busca = termoBusca.toLowerCase();
    return (
      usuario.nome?.toLowerCase().includes(busca) ||
      usuario.email?.toLowerCase().includes(busca)
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <Button
          className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 shadow-md w-full sm:w-auto"
          onClick={() => setModalAberto(true)}
        >
          <Plus className="size-4" /> Novo Coordenador
        </Button>

        <SearchInput
          value={termoBusca}
          onChange={setTermoBusca}
          placeholder="Buscar por nome ou e-mail..."
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        {carregando ? (
          <div className="p-10 text-center text-slate-500">
            Carregando coordenadores...
          </div>
        ) : (
          <DataTable
            columns={colunas}
            data={usuariosFiltrados}
            onEditClick={(row: any) => handleEditar(row)}
            onDeleteClick={(row: any) => handleExcluir(row.id, row.nome)}
          />
        )}
      </div>

      <ModalCriarCoordenador
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={carregarCoordenadores} // Recarrega a tabela após criar!
      />
    </div>
  );
}
