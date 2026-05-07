"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { NovoEstudanteModal } from "@/components/NovoEstudanteModal";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

export function TabelaEstudantes({ colunas }: any) {
  const [modalAberto, setModalAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [estudantes, setEstudantes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarEstudantes = async () => {
    try {
      setCarregando(true);
      
      // 1. Quem está logado?
      const storage = localStorage.getItem("usuarioLogado");
      const sessao = storage ? JSON.parse(storage) : null;
      const meuid = sessao?.id;

      if (!meuid) {
        console.error("Erro: Usuário não está logado.");
        setCarregando(false);
        return;
      }

      // 2. A SACADA DE MESTRE: Descobrimos o curso batendo na API de cursos!
      const resCursos = await fetch(`http://localhost:3001/api/cursos?coordenadorId=${meuid}`);
      
      if (!resCursos.ok) throw new Error("Erro ao buscar os cursos do coordenador.");
      
      const cursos = await resCursos.json();

      // Se o backend devolver uma lista vazia, significa que o Vitor não tem curso.
      if (!cursos || cursos.length === 0) {
        console.warn("Nenhum curso vinculado a este coordenador.");
        setEstudantes([]);
        setCarregando(false);
        return;
      }

      // Pegamos o ID do primeiro curso retornado (no seu Postman é o "ccf8...")
      const cursoIdDoVitor = cursos[0].id;
      const nomeDoCurso = cursos[0].nome;

      // 3. A BUSCA FINAL: Trazemos os alunos ricos (com CPF e Período) daquele curso
      const urlAlunos = `http://localhost:3001/api/usuarios?tipo=ALUNO&cursoId=${cursoIdDoVitor}`;
      
      const resAlunos = await fetch(urlAlunos);
      const alunos = await resAlunos.json();
      
      // 4. Formatação para a tabela
      const dadosFormatados = alunos.map((usuario: any) => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        status: usuario.status || "Ativo",
        cpf: usuario.aluno?.cpf || "Sem CPF",
        periodo: usuario.aluno?.periodo || "-",
        curso: usuario.curso?.nome || nomeDoCurso 
      }));
      
      setEstudantes(dadosFormatados);

    } catch (error) {
      console.error("Erro ao carregar estudantes:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEstudantes();
  }, []);

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
          <h1 className="text-2xl font-bold text-slate-800">Estudantes do Curso</h1>
          <p className="text-sm text-slate-500">Listando alunos vinculados ao seu curso.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <SearchInput
            value={termoBusca}
            onChange={setTermoBusca}
            placeholder="Buscar por nome ou CPF..."
          />

          <Button
            variant="outline"
            onClick={carregarEstudantes}
            disabled={carregando}
            className="px-3 hidden sm:flex"
          >
            <RefreshCw className={`size-4 ${carregando ? "animate-spin" : ""}`} />
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
          onClose={(sucesso) => {
            setModalAberto(false);
            // Só recarrega se o estudante foi realmente criado
            if (sucesso === true) carregarEstudantes();
          }}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
        {carregando ? (
          <div className="p-20 text-center text-slate-500">
            <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-[#004A8D]" />
            Carregando estudantes do seu curso...
          </div>
        ) : (
          <>
            <DataTable columns={colunas} data={estudantesFiltrados} />
            {estudantesFiltrados.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                Nenhum estudante encontrado {termoBusca ? `para "${termoBusca}"` : "neste curso"}.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}