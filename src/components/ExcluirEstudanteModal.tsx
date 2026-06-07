"use client";

import { useState } from "react";
import { ModalBase } from "@/components/ModalBase";
import { AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";


interface ExcluirEstudanteModalProps {
  isOpen: boolean;
  onClose: (sucesso?: boolean) => void;
  estudante: any;
}

export function ExcluirEstudanteModal({ isOpen, onClose, estudante }: ExcluirEstudanteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExcluir = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      
      const response = await api(`/api/aluno-coordenador/alunos/${estudante.alunoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Não foi possível excluir o aluno. Ele pode ter registros amarrados no sistema.");
        setIsSubmitting(false);
        return;
      }

      onClose(true); 
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
      title="Excluir Estudante"
      description={`Tem certeza que deseja remover ${estudante?.nome}?`}
      icon={<AlertTriangle className="h-12 w-12 text-red-600" />}
      submitText={isSubmitting ? "Excluindo..." : "Sim, Excluir"}
      onSubmit={handleExcluir}
    >
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm font-medium">
          Atenção: Esta ação é irreversível. O usuário e todos os dados vinculados a este aluno serão removidos permanentemente do banco de dados.
        </p>
      </div>
    </ModalBase>
  );
}