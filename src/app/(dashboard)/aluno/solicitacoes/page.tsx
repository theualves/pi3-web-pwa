"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable"; 
import { ModalEditarAtividade } from "@/components/ModalEditarAtividade";

export default function AlunoSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  // Estados para o Modal de Edição
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [atividadeEditando, setAtividadeEditando] = useState<any | null>(null);

  const columns = [
    { header: "Atividades Enviadas", accessor: "titulo" },
    { header: "Data de Envio", accessor: "dataEnvioFormatada" }, 
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  // 1. EXTRAÍMOS A FUNÇÃO PARA PODERMOS CHAMAR ELA DE NOVO QUANDO ALGO FOR EXCLUÍDO OU EDITADO
  const carregarMinhasSolicitacoes = async () => {
    setCarregando(true);
    try {
      const usuarioStorage = localStorage.getItem("usuarioLogado");
      const usuarioLogado = usuarioStorage ? JSON.parse(usuarioStorage) : null;
      const alunoId = usuarioLogado?.idAluno || usuarioLogado?.aluno?.id || usuarioLogado?.id;

      if (!alunoId) {
        setCarregando(false);
        return;
      }

      const url = `https://api-horas-complementares.onrender.com/api/aluno-portal/${alunoId}/solicitacoes`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Erro ao buscar.");

      const data = await response.json();

      const dadosFormatados = data.solicitacoes.map((item: any) => ({
        ...item,
        dataEnvioFormatada: new Date(item.dataEnvio).toLocaleDateString("pt-BR"),
      }));

      setSolicitacoes(dadosFormatados);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Carrega ao abrir a tela
  useEffect(() => {
    carregarMinhasSolicitacoes();
  }, []);

  // 2. FUNÇÃO DE EDITAR (Abre o modal)
  const handleEditar = (row: any) => {
    if (!row.podeEditar) {
      alert("Atividades Aprovadas ou validadas não podem ser editadas.");
      return;
    }
    setAtividadeEditando(row);
    setModalEditarAberto(true);
  };

  // 3. FUNÇÃO DE EXCLUIR (Integração com a API)
  const handleExcluir = async (row: any) => {
    if (!row.podeExcluir) {
      alert("Atividades Aprovadas ou validadas não podem ser excluídas.");
      return;
    }
    
    const confirmar = confirm(`Tem certeza que deseja excluir permanentemente a atividade "${row.titulo}"?`);
    if (!confirmar) return;

    try {
      const usuarioStorage = localStorage.getItem("usuarioLogado");
      const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
      const alunoId = usuario?.idAluno || usuario?.aluno?.id || usuario?.id;

      const url = `https://api-horas-complementares.onrender.com/api/aluno-portal/${alunoId}/solicitacoes/${row.id}`;
      
      // Manda o DELETE para a API
      const response = await fetch(url, { method: "DELETE" });

      if (!response.ok) throw new Error("Erro ao excluir.");

      alert("Atividade excluída com sucesso!");
      // Recarrega a tabela imediatamente!
      carregarMinhasSolicitacoes(); 

    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao tentar excluir. Tente novamente.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-[#004A8D]">
          Minhas Solicitações
        </h1>
      </div>

      {carregando && solicitacoes.length === 0 ? (
        <div className="flex justify-center items-center h-32 text-slate-500 font-medium">
          Carregando suas atividades...
        </div>
      ) : solicitacoes.length === 0 ? (
        <div className="flex justify-center items-center h-32 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
          Você ainda não enviou nenhuma atividade.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={solicitacoes}
          onEditClick={handleEditar}
          onDeleteClick={handleExcluir}
        />
      )}

      {/* MODAL DE EDIÇÃO PLUGADO AQUI */}
      <ModalEditarAtividade 
        isOpen={modalEditarAberto}
        onClose={() => setModalEditarAberto(false)}
        atividade={atividadeEditando}
        onSuccess={carregarMinhasSolicitacoes} 
      />
    </div>
  );
}