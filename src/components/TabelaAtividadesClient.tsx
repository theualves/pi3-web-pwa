"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { ValidarAtividadeModal } from "@/components/ValidarAtividadeModal";
import { SearchInput } from "@/components/SearchInput";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TabelaAtividadesClient() {
  const [atividades, setAtividades] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState<any | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  // 1. FUNÇÃO DE BUSCA FILTRADA POR CURSO (BLINDADA)
  const buscarAtividades = async () => {
    setCarregando(true);
    try {
      // 1. Pega o ID de quem está logado
      const storage = localStorage.getItem("usuarioLogado");
      const sessao = storage ? JSON.parse(storage) : null;
      const meuid = sessao?.id;

      if (!meuid) {
        console.error("Nenhum usuário logado encontrado.");
        setCarregando(false);
        return;
      }

      const resCursos = await fetch(`https://api-horas-complementares.onrender.com/api/cursos?coordenadorId=${meuid}`);
      if (!resCursos.ok) throw new Error("Erro ao buscar os cursos do coordenador.");
      
      const cursos = await resCursos.json();

      if (!cursos || cursos.length === 0) {
        console.warn("Nenhum curso vinculado a este coordenador.");
        setAtividades([]); // Deixa a tabela vazia se não tiver curso
        setCarregando(false);
        return;
      }

      const cursoIdDoCoordenador = cursos[0].id;

      // 3. Agora sim! Buscamos as atividades usando a chave do curso confirmada!
      const url = `http://localhost:3001/api/atividades?cursoId=${cursoIdDoCoordenador}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Erro ao buscar atividades");
      
      const data = await response.json();
      setAtividades(data);

    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  // Busca os dados assim que o componente monta
  useEffect(() => {
    buscarAtividades();
  }, []);

  // 2. TRADUTOR DE DADOS (Memoizado para performance)
  const atividadesFormatadas = useMemo(() => {
    return atividades.map((item: any) => ({
      original: item, 
      id: item.id,
      estudante: item.aluno?.usuario?.nome || "Não informado",
      categoriaCarga: `${item.categoria} (${item.horasSolicitadas}h)`,
      periodo: `${item.aluno?.periodo || "-"}º Período`,
      status: item.status,
      titulo: item.titulo 
    }));
  }, [atividades]);

  const colunas = [
    { header: "Estudante", accessor: "estudante" },
    { header: "Atividade / Categoria", accessor: "categoriaCarga" },
    { header: "Período", accessor: "periodo" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  const handleAbrirValidacao = (linha: any) => {
    setAtividadeSelecionada(linha.original);
    setModalAberto(true);
  };

  // 3. LÓGICA DE FILTRO (Busca local na lista do curso)
  const atividadesFiltradas = atividadesFormatadas.filter((atv) => {
    const busca = termoBusca.toLowerCase();
    return (
      atv.estudante.toLowerCase().includes(busca) || 
      atv.categoriaCarga.toLowerCase().includes(busca) ||
      atv.titulo?.toLowerCase().includes(busca)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Atividades Submetidas</h1>
          <p className="text-sm text-slate-500">Exibindo atividades dos alunos do seu curso.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <SearchInput
            value={termoBusca}
            onChange={setTermoBusca}
            placeholder="Buscar por estudante ou categoria..."
          />
          
          {/* Adicionei um botão de recarregar manual para facilitar a vida do Coordenador */}
          <Button
            variant="outline"
            onClick={buscarAtividades}
            disabled={carregando}
            className="px-3 hidden sm:flex"
            title="Atualizar lista"
          >
            <RefreshCw className={`size-4 ${carregando ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-[200px] flex flex-col justify-center">
        {carregando ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#004A8D]" />
            <p className="text-slate-500 text-sm">Carregando atividades do curso...</p>
          </div>
        ) : (
          <>
            <DataTable
              columns={colunas}
              data={atividadesFiltradas}
              onViewClick={handleAbrirValidacao}
            />

            {atividadesFiltradas.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                {termoBusca 
                  ? `Nenhuma atividade encontrada para "${termoBusca}".` 
                  : "Nenhuma atividade submetida para o seu curso."}
              </div>
            )}
          </>
        )}
      </div>

      <ValidarAtividadeModal
        atividade={atividadeSelecionada}
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={buscarAtividades} 
      />
    </div>
  );
}