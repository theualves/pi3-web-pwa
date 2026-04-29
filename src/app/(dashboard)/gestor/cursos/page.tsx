"use client";

import { useState, useEffect } from "react"; // Adicionamos o useEffect
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react"; // Adicionei um ícone de refresh
import { ModalCriarCurso } from "@/components/ModalCriarCurso"; 

export default function CursosPage() {
  const [modalAberto, setModalAberto] = useState(false);
  
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão de Cursos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualize e gerencie os programas acadêmicos do banco de dados.
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={carregarCursos}
            disabled={carregando}
          >
            <RefreshCw className={`size-4 ${carregando ? "animate-spin" : ""}`} />
          </Button>

          <Button 
            onClick={() => setModalAberto(true)} 
            className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2"
          >
            <Plus className="size-4" />
            Novo Curso
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <DataTable 
          columns={colunas} 
          data={cursos} 
          onViewClick={handleVisualizarCurso} 
        />
        {!carregando && cursos.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            Nenhum curso encontrado no banco de dados.
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