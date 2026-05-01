"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Search } from "lucide-react"; // <-- Adicionei o ícone Search
import { ModalCriarCurso } from "@/components/ModalCriarCurso"; 

export default function CursosPage() {
  const [modalAberto, setModalAberto] = useState(false);
  
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // 1. Estado para armazenar o que o usuário está buscando
  const [termoBusca, setTermoBusca] = useState("");

  const carregarCursos = async () => {
    try {
      setCarregando(true);
      const response = await fetch("http://localhost:3001/api/cursos");
      const dados = await response.json();
      setCursos(dados);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  // 2. Filtra os cursos em tempo real com base no que foi digitado
  const cursosFiltrados = cursos.filter((curso: any) =>
    curso.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const colunas = [
    { header: "Nome do Curso", accessor: "nome" },
    { header: "Tipo", accessor: "tipo" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" }, 
  ];

  const handleVisualizarCurso = (curso: any) => {
    alert(`Detalhes de: ${curso.nome}\nMeta de Horas: ${curso.metaHoras}`);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão de Cursos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualize e gerencie os programas acadêmicos do banco de dados.
          </p>
        </div>

        {/* 3. Área de Controles: Busca + Botões */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          
          {/* Campo de Busca com ícone embutido */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar curso..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm outline-none transition-all focus:border-[#004A8D] focus:ring-1 focus:ring-[#004A8D]"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={carregarCursos}
              disabled={carregando}
              className="px-3"
            >
              <RefreshCw className={`size-4 ${carregando ? "animate-spin" : ""}`} />
            </Button>

            <Button 
              onClick={() => setModalAberto(true)} 
              className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="size-4" />
              Novo Curso
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        
        {/* 4. Trocamos 'data={cursos}' para 'data={cursosFiltrados}' */}
        <DataTable 
          columns={colunas} 
          data={cursosFiltrados} 
          onViewClick={handleVisualizarCurso} 
        />
        
        {/* 5. Avisos Dinâmicos */}
        {!carregando && cursos.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum curso encontrado no banco de dados.
          </div>
        )}
        {!carregando && cursos.length > 0 && cursosFiltrados.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum curso corresponde à busca "{termoBusca}".
          </div>
        )}
      </div>

      <ModalCriarCurso 
        isOpen={modalAberto} 
        onClose={() => {
          setModalAberto(false);
          carregarCursos(); 
        }} 
      />
    </div>
  );
}