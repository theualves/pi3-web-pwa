"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookPlus } from "lucide-react";
import { ModalBase } from "@/components/ModalBase"; 

interface ModalCriarCursoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalCriarCurso({ isOpen, onClose }: ModalCriarCursoProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [horas, setHoras] = useState("");
  // Definindo "Ativo" de forma que o select já inicie correto
  const [status, setStatus] = useState("Ativo");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica de campos vazios
    if (!nome || !tipo || !horas) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nome: nome,
      tipoFormacao: tipo,            // Antes era tipoCurso
      metaHoras: parseInt(horas, 10),// Antes era cargaHoraria
      statusInicial: status          // Antes era status
    };

    try {
      const response = await fetch("http://localhost:3001/api/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erros do backend:", errorData);
        alert("Erro ao salvar o curso. Verifique se o nome já existe.");
        setIsSubmitting(false);
        return;
      }

      // Se deu sucesso:
      // 1. Limpamos os campos para o próximo cadastro
      setNome("");
      setTipo("");
      setHoras("");
      setStatus("Ativo");
      
      // 2. Fechamos o modal (como configuramos no pai, isso vai recarregar a tabela automaticamente!)
      onClose();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Novo Curso"
      description="Preencha os dados abaixo para registrar um novo programa acadêmico na instituição."
      icon={<BookPlus className="h-6 w-6" />}
      submitText={isSubmitting ? "Salvando..." : "Salvar Curso"}
      onSubmit={handleSalvar}
    >
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-slate-700">Nome do Curso</Label>
        <Input
          id="nome"
          placeholder="Ex: Bacharelado em Enfermagem"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={isSubmitting}
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-700">Tipo de Formação</Label>
          <Select value={tipo} onValueChange={setTipo} required disabled={isSubmitting}>
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
            min="0"
            placeholder="Ex: 300"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            required
            disabled={isSubmitting}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">Status Inicial</Label>
        <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
          <SelectTrigger className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* O value enviado pro back será exatamente o que está na propriedade 'value' */}
            <SelectItem value="Ativo">Ativo (Permite matrículas)</SelectItem>
            <SelectItem value="Inativo">Inativo (Apenas planejamento)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ModalBase>
  );
}