"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalBase } from "@/components/ModalBase";
import { IconeSenac } from "./IconeSenac";

interface NovaTurmaModalProps {
  isOpen: boolean;
  onClose: (sucesso?: boolean) => void;
}

export function NovaTurmaModal({ isOpen, onClose }: NovaTurmaModalProps) {
  const [nome, setNome] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [cursos, setCursos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storage = localStorage.getItem("usuarioLogado");
      const usuarioLogado = storage ? JSON.parse(storage) : null;
      const coordenadorId = usuarioLogado?.id;

      if (coordenadorId) {
        const urlCursos = `https://api-horas-complementares.onrender.com/api/cursos?coordenadorId=${coordenadorId}`;

        fetch(urlCursos)
          .then((res) => res.json())
          .then((data) => {
            setCursos(data);
            // Pré-seleciona se houver um curso padrão
            const idDoCursoPadrao = usuarioLogado?.cursoId || usuarioLogado?.usuario?.cursoId;
            if (idDoCursoPadrao) setCursoId(idDoCursoPadrao);
          })
          .catch((err) => console.error("Erro ao buscar cursos:", err));
      }
    } else {
      // Limpeza ao fechar
      setNome("");
      // Não limpamos o cursoId para facilitar cadastros sequenciais, 
      // mas você pode setar vazio se preferir
    }
  }, [isOpen]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !cursoId) {
      alert("Por favor, preencha o nome da turma e selecione o curso.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nome: nome,
      cursoId: cursoId,
    };

    try {
      const response = await fetch(
        "https://api-horas-complementares.onrender.com/api/turmas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const erroBackend = await response.json();
        alert(`Erro: ${erroBackend.erro || "Não foi possível criar a turma."}`);
        setIsSubmitting(false);
        return;
      }

      onClose(true); // Sucesso
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title="Cadastrar Nova Turma"
      description="Informe o nome da turma e associe-a a um curso existente."
      icon={<IconeSenac className="h-12 w-12 text-[#004A8D]" />}
      submitText={isSubmitting ? "Cadastrando..." : "Cadastrar Turma"}
      onSubmit={handleSalvar}
    >
      <div className="space-y-4">
        {/* Nome da Turma */}
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-slate-700">
            Nome da Turma
          </Label>
          <Input
            id="nome"
            placeholder="Ex: TAS049"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={isSubmitting}
            className="h-11"
          />
        </div>

        {/* Curso Associado */}
        <div className="space-y-2">
          <Label className="text-slate-700">Curso Vinculado</Label>
          <Select
            value={cursoId}
            onValueChange={setCursoId}
            disabled={isSubmitting}
            required
          >
            <SelectTrigger className="h-11 w-full overflow-hidden">
              <span className="truncate block text-left w-full pr-4">
                <SelectValue
                  placeholder={
                    cursos.length > 0 ? "Selecione o curso" : "Carregando cursos..."
                  }
                />
              </span>
            </SelectTrigger>
            <SelectContent>
              {cursos.map((curso) => (
                <SelectItem key={curso.id} value={curso.id}>
                  {curso.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </ModalBase>
  );
}