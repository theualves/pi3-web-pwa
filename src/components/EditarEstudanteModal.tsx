"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalBase } from "@/components/ModalBase";
import { IconeSenac } from "./IconeSenac";

interface EditarEstudanteModalProps {
  isOpen: boolean;
  onClose: (sucesso?: boolean) => void;
  estudante: any;
}

export function EditarEstudanteModal({ isOpen, onClose, estudante }: EditarEstudanteModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preenche o formulário quando o modal abre
  useEffect(() => {
    if (estudante && isOpen) {
      setNome(estudante.nome || "");
      setEmail(estudante.email || "");
      setPeriodo(String(estudante.periodo || ""));
    }
  }, [estudante, isOpen]);

  const handleSalvar = async (e: React.FormEvent) => {
    console.log("ID DO ALUNO QUE ESTOU TENTANDO EDITAR:", estudante.alunoId);
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      nome: nome,
      email: email,
      periodo: parseInt(periodo, 10),
    };

    try {
      // Ajuste o endpoint "/api/alunos" se a sua rota no Render for um nome diferente
      const response = await fetch(`https://api-horas-complementares.onrender.com/api/aluno-coordenador/alunos/${estudante.alunoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(`Erro ao atualizar: ${erro.erro || "Verifique os dados"}`);
        setIsSubmitting(false);
        return;
      }

      onClose(true); // Sucesso! Fecha e atualiza a tabela
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title="Editar Estudante"
      description={`Atualize os dados de ${estudante?.nome}`}
      icon={<IconeSenac className="h-12 w-12 text-[#004A8D]" />}
      submitText={isSubmitting ? "Salvando..." : "Salvar Alterações"}
      onSubmit={handleSalvar}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} required disabled={isSubmitting} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CPF (Apenas Visualização)</Label>
            <Input value={estudante?.cpf || ""} disabled className="bg-gray-100" />
          </div>
          <div className="space-y-2">
            <Label>Período</Label>
            <Input type="number" min="1" max="12" value={periodo} onChange={(e) => setPeriodo(e.target.value)} required disabled={isSubmitting} />
          </div>
        </div>
      </div>
    </ModalBase>
  );
}