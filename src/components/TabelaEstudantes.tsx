"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { NovoEstudanteModal } from "@/components/NovoEstudanteModal";
import { EditarEstudanteModal } from "@/components/EditarEstudanteModal"; 
import { ExcluirEstudanteModal } from "@/components/ExcluirEstudanteModal"; 
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { api } from "@/lib/api";

// 1. Recebemos o turmaId como prop opcional
export function TabelaEstudantes({ colunas, turmaId }: any) {
  const [modalAberto, setModalAberto] = useState(false);
  
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

      
      const resCursos = await api(`/api/cursos?coordenadorId=${meuid}`);
      if (!resCursos.ok) throw new Error("Erro ao buscar os cursos.");
      const cursos = await resCursos.json();

      if (!cursos || cursos.length === 0) {
        setEstudantes([]);
        setCarregando(false);
        return;
      }

      const cursoIdDoVitor = cursos[0].id;
      const nomeDoCurso = cursos[0].nome;

      let urlAlunos = "";
      if (turmaId) {
        urlAlunos = `/api/aluno-coordenador?turmaId=${turmaId}`;
      } else {
        urlAlunos = `/api/usuarios?tipo=ALUNO&cursoId=${cursoIdDoVitor}`;
      }
      
      const resAlunos = await api(urlAlunos);
      const alunos = await resAlunos.json();
      
      // 3. Formatação ajustada para lidar com as duas rotas
      const dadosFormatados = alunos.map((item: any) => ({
        id: item.id,
        alunoId: item.aluno?.id || item.id, // IDs para exclusão/edição
        nome: item.usuario?.nome || item.nome,
        email: item.usuario?.email || item.email,
        status: item.usuario?.status || item.status || "Ativo",
        cpf: item.cpf || item.aluno?.cpf || "Sem CPF",
        periodo: item.periodo || item.aluno?.periodo || "",
        cursoId: item.cursoId || cursoIdDoVitor,
        curso: item.curso?.nome || nomeDoCurso,
        turma: item.turmaId || item.aluno?.turma || "",
        cargaExigida: item.cargaExigida || item.aluno?.cargaExigida || "",
        horasRegistradas: item.cargaExigida || item.aluno?.cargaExigida || 0
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
  }, [turmaId]); 

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
          <p className="text-sm text-slate-500">Listando alunos vinculados.</p>
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

        <NovoEstudanteModal
          isOpen={modalAberto}
          onClose={(sucesso) => {
            setModalAberto(false);
            if (sucesso) carregarEstudantes();
          }}
          turmaIdPreSelecionada={turmaId}
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

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {carregando ? (
          <div className="p-20 text-center text-slate-500">Carregando...</div>
        ) : (
          <DataTable 
            columns={colunas} 
            data={estudantesFiltrados} 
            onEditClick={(row: any) => setEstudanteEditando(row)}
            onDeleteClick={(row: any) => setEstudanteExcluindo(row)}
          />
        )}
      </div>
    </div>
  );
}