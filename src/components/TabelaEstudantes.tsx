"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { NovoEstudanteModal } from "@/components/NovoEstudanteModal";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react"; // Adicionado ícone de recarregar
import { SearchInput } from "@/components/SearchInput";

// 1. Removemos 'estudantes' das propriedades. Agora a tabela busca os próprios dados!
export function TabelaEstudantes({ colunas }: any) {
  const [modalAberto, setModalAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  // 2. Criamos os estados para guardar os alunos que vêm do banco
  const [estudantes, setEstudantes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarEstudantes = async () => {
    try {
      setCarregando(true);
      
      const response = await fetch("http://localhost:3001/api/usuarios?tipo=ALUNO");
      const dados = await response.json();
      
      // A MÁGICA ACONTECE AQUI: Vamos mapear e "achatar" os dados do Prisma!
      const dadosFormatados = dados.map((usuario: any) => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        status: usuario.status || "Ativo",
        // Puxa o CPF e Período de dentro da relação "aluno"
        cpf: usuario.aluno?.cpf || "Sem CPF",
        periodo: usuario.aluno?.periodo || "-",
        // Puxa o nome do Curso de dentro da relação "curso"
        curso: usuario.curso?.nome || "Sem curso" 
      }));
      
      // Salvamos no estado os dados já limpos e formatados!
      setEstudantes(dadosFormatados);

    } catch (error) {
      console.error("Erro ao carregar estudantes:", error);
    } finally {
      setCarregando(false);
    }
  };

  // 4. Executa a busca automaticamente quando a tela é aberta
  useEffect(() => {
    carregarEstudantes();
  }, []);

  // 5. Blindagem de segurança caso o backend mande vazio
  const listaSegura = Array.isArray(estudantes) ? estudantes : [];

  const estudantesFiltrados = listaSegura.filter((estudante: any) => {
    const nome = estudante.nome?.toLowerCase() || "";
    const cpf = estudante.cpf?.toLowerCase() || "";
    const busca = termoBusca.toLowerCase();

    return nome.includes(busca) || cpf.includes(busca);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Estudantes</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <SearchInput
            value={termoBusca}
            onChange={setTermoBusca}
            placeholder="Buscar por nome ou CPF..."
          />

          {/* Botão extra para recarregar a tabela manualmente (ótimo para UX) */}
          <Button
            variant="outline"
            onClick={carregarEstudantes}
            disabled={carregando}
            className="px-3 hidden sm:flex"
          >
            <RefreshCw
              className={`size-4 ${carregando ? "animate-spin" : ""}`}
            />
          </Button>

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
          onClose={() => {
            setModalAberto(false);
            // 6. A MÁGICA: Assim que o modal fechar, a tabela atualiza sozinha!
            carregarEstudantes();
          }}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <DataTable columns={colunas} data={estudantesFiltrados} />

        {carregando && (
          <div className="p-8 text-center text-slate-500">
            Carregando estudantes...
          </div>
        )}

        {!carregando && estudantesFiltrados.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum estudante encontrado{" "}
            {termoBusca ? `para "${termoBusca}"` : "no banco de dados"}.
          </div>
        )}
      </div>
    </div>
  );
}
