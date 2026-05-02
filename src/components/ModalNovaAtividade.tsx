"use client";

import { ModalBase } from "@/components/ModalBase";
import { useState } from "react";
import { BookPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModalNovaAtividadeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalNovaAtividade({
  isOpen,
  onClose,
}: ModalNovaAtividadeProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui no futuro entrará o seu fetch("http://localhost:3001/api/estudantes", ...)
    console.log("Dados prontos para o backend:", {
      nome,
      categoria,
      dataInicio,
      cargaHoraria,
      descricao,
    });
    // Limpa e fecha após salvar
    onClose();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar nova atividade"
      description="Preencha os dados abaixo para registrar uma nova atividade no sistema."
      icon={<BookPlus className="h-6 w-6" />}
      submitText="Cadastrar"
      onSubmit={handleSalvar}
    >
      <div>
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-slate-700">
            Nome
          </Label>
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="h-11"
          />
        </div>

        {/* Coloquei Curso e Período lado a lado para economizar espaço e ficar mais bonito */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicio" className="text-slate-700">
              Data de inicio
            </Label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ch" className="text-slate-700">
              Carga Horária
            </Label>
            <Input
              id="ch"
              type="number"
              value={cargaHoraria}
              onChange={(e) => setCargaHoraria(e.target.value)}
              required
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao" className="text-slate-700">
            Descrição
          </Label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            placeholder="Descreva as atividades realizadas..."
            className="flex w-full min-h-[100px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004A8D] focus-visible:ring-offset-2 resize-none"
          />
        </div>
      </div>
    </ModalBase>
  );
}
