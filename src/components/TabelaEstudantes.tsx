"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { NovoEstudanteModal } from "@/components/NovoEstudanteModal";
import { EditarEstudanteModal } from "@/components/EditarEstudanteModal"; // NOVO
import { ExcluirEstudanteModal } from "@/components/ExcluirEstudanteModal"; // NOVO
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

export function TabelaEstudantes({ colunas }: any) {
  const [modalAberto, setModalAberto] = useState(false);
  
  // NOVOS ESTADOS PARA OS MODAIS DE EDIÇÃO E EXCLUSÃO
  const [estudanteEditando, setEstudanteEditando] = useState<any>(null);
  const [estudanteExcluindo, setEstudanteExcluindo] = useState<any>(null);

  const [termoBusca, setTermoBusca] = useState("");
  const [estudantes, setEstudantes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarEstudantes = async () => {
    try {
      setCarregando(true);
      
      const storage = localStorage.getItem("usuarioLogado");
      const sessao = storage ? JSON.parse(storage) : null;
      const meuid = sessao?.id;

      if (!meuid) return;

      const resCursos = await fetch(`https://api-horas-complementares.onrender.com/api/cursos?coordenadorId=${meuid}`);
      if (!resCursos.ok) throw new Error("Erro ao buscar os cursos.");
      const cursos = await resCursos.json();

      if (!cursos || cursos.length === 0) {
        setEstudantes([]);
        setCarregando(false);
        return;
      }

      const cursoIdDoVitor = cursos[0].id;
      const nomeDoCurso = cursos[0].nome;

      const urlAlunos = `https://api-horas-complementares.onrender.com/api/usuarios?tipo=ALUNO&cursoId=${cursoIdDoVitor}`;
      const resAlunos = await fetch(urlAlunos);
      const alunos = await resAlunos.json();
      
      // ATENÇÃO: Adicionamos o alunoId e os dados brutos para o Modal de Edição conseguir usar!
      const dadosFormatados = alunos.map((usuario: any) => ({
        id: usuario.id,
        alunoId: usuario.aluno?.id, // ID necessário para dar o PUT e DELETE no backend
        nome: usuario.nome,
        email: usuario.email,
        status: usuario.status || "Ativo",
        cpf: usuario.aluno?.cpf || "Sem CPF",
        periodo: usuario.aluno?.periodo || "",
        cursoId: usuario.cursoId || cursoIdDoVitor,
        curso: usuario.curso?.nome || nomeDoCurso,
        turma: usuario.aluno?.turma || "",
        cargaExigida: usuario.aluno?.cargaExigida || "",
        horasRegistradas: usuario.aluno?.cargaExigida || 0
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
          <SearchInput value={termoBusca} onChange={setTermoBusca} placeholder="Buscar por nome ou CPF..." />
          <Button variant="outline" onClick={carregarEstudantes} disabled={carregando} className="px-3 hidden sm:flex">
            <RefreshCw className={`size-4 ${carregando ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setModalAberto(true)} className="bg-[#004A8D] hover:bg-[#003666] text-white">
            <Plus className="size-4 mr-2" /> Novo Estudante
          </Button>
        </div>

        {/* MODAIS */}
        <NovoEstudanteModal
          isOpen={modalAberto}
          onClose={(sucesso) => {
            setModalAberto(false);
            if (sucesso) carregarEstudantes();
          }}
        />

        {estudanteEditando && (
          <EditarEstudanteModal
            estudante={estudanteEditando}
            isOpen={!!estudanteEditando}
            onClose={(sucesso) => {
              setEstudanteEditando(null);
              if (sucesso) carregarEstudantes();
            }}
          />
        )}

        {estudanteExcluindo && (
          <ExcluirEstudanteModal
            estudante={estudanteExcluindo}
            isOpen={!!estudanteExcluindo}
            onClose={(sucesso) => {
              setEstudanteExcluindo(null);
              if (sucesso) carregarEstudantes();
            }}
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
        {carregando ? (
          <div className="p-20 text-center text-slate-500">Carregando...</div>
        ) : (
          <DataTable 
            columns={colunas} 
            data={estudantesFiltrados} 
            // CONECTANDO OS BOTÕES DA TABELA COM OS MODAIS
            onEditClick={(row) => setEstudanteEditando(row)}
            onDeleteClick={(row) => setEstudanteExcluindo(row)}
          />
        )}
      </div>
    </div>
  );
}