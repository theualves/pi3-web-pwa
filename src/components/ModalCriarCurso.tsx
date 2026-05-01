"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookPlus } from "lucide-react";
// Importamos a nossa casca genérica
import { ModalBase } from "@/components/ModalBase"; 

interface ModalCriarCursoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalCriarCurso({ isOpen, onClose }: ModalCriarCursoProps) {
  // Seus estados continuam iguais
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [horas, setHoras] = useState("");
  const [status, setStatus] = useState("Ativo");

  // Sua função handleSalvar continua EXATAMENTE igual (ocultei aqui só para resumir)
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... sua lógica de fetch e validação ...
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Novo Curso"
      description="Preencha os dados abaixo para registrar um novo programa acadêmico na instituição."
      icon={<BookPlus className="h-6 w-6" />}
      submitText="Salvar Curso"
      onSubmit={handleSalvar}
    >
      {/* 
        TUDO O QUE COLOCARMOS AQUI DENTRO É O "children".
        Ele vai ser injetado no meio do ModalBase.
      */}
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-slate-700">Nome do Curso</Label>
        <Input
          id="nome"
          placeholder="Ex: Bacharelado em Enfermagem"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-700">Tipo de Formação</Label>
          <Select value={tipo} onValueChange={setTipo} required>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tecnólogo">Tecnólogo</SelectItem>
              <SelectItem value="Bacharelado">Bacharelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="horas" className="text-slate-700">Meta de Horas (Extensão)</Label>
          <Input
            id="horas"
            type="number"
            placeholder="Ex: 300"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">Status Inicial</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ativo">Ativo (Permite matrículas)</SelectItem>
            <SelectItem value="Inativo">Inativo (Apenas planejamento)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ModalBase>
  );
}