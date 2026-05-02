"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookPlus } from "lucide-react"; 
import { ModalBase } from "@/components/ModalBase";

// 1. Recebemos o isOpen e onClose do componente pai (a página)
interface NovoEstudanteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovoEstudanteModal({ isOpen, onClose }: NovoEstudanteModalProps) {
  // 2. Criamos os estados para capturar o que o usuário digitar
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [curso, setCurso] = useState("");
  const [periodo, setPeriodo] = useState("");

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui no futuro entrará o seu fetch("http://localhost:3001/api/estudantes", ...)
    console.log("Dados prontos para o backend:", { nome, email, cpf, curso, periodo });
    
    // Limpa e fecha após salvar
    onClose();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar aluno"
      description="Preencha os dados abaixo para registrar um novo estudante no sistema."
      icon={<BookPlus className="h-6 w-6" />}
      submitText="Cadastrar"
      onSubmit={handleSalvar}
    >
      
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-slate-700">Nome</Label>
        <Input 
          id="nome" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cpf" className="text-slate-700">CPF</Label>
        <Input 
          id="cpf" 
          value={cpf} 
          onChange={(e) => setCpf(e.target.value)} 
          required 
          className="h-11"
          placeholder="000.000.000-00"
        />
      </div>

      {/* Coloquei Curso e Período lado a lado para economizar espaço e ficar mais bonito */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="curso" className="text-slate-700">Curso</Label>
          <Input 
            id="curso" 
            value={curso} 
            onChange={(e) => setCurso(e.target.value)} 
            required 
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodo" className="text-slate-700">Período</Label>
          <Input 
            id="periodo" 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)} 
            required 
            className="h-11"
            placeholder="Ex: 1º Semestre"
          />
        </div>
      </div>
      
    </ModalBase>
  );
}