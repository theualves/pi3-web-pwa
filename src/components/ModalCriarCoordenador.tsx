"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { ModalBase } from "@/components/ModalBase";

interface ModalCriarCoordenadorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalCriarCoordenador({ isOpen, onClose, onSuccess }: ModalCriarCoordenadorProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [status, setStatus] = useState("Ativo");
  
  const [cursos, setCursos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Busca a lista de cursos para o Select
  useEffect(() => {
    if (isOpen) {
      fetch("https://api-horas-complementares.onrender.com/api/cursos")
        .then((res) => res.json())
        .then((data) => setCursos(data))
        .catch((err) => console.error("Erro ao carregar cursos:", err));
    }
  }, [isOpen]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !cursoId) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nome: nome,
      email: email,
      senha: "123", // Senha padrão conforme sua regra
      tipo: "COORDENADOR",
      cursoId: cursoId,
      status: status,
    };

    try {
      const response = await fetch("https://api-horas-complementares.onrender.com/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar coordenador.");
      }

      // Limpeza e Sucesso
      setNome("");
      setEmail("");
      setCursoId("");
      setStatus("Ativo");
      
      onSuccess(); // Recarrega a tabela na página pai
      onClose();   // Fecha o modal
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Novo Coordenador"
      description="Informe os dados básicos e vincule o coordenador a um curso específico."
      icon={<UserPlus className="h-6 w-6" />}
      submitText={isSubmitting ? "Cadastrando..." : "Salvar Coordenador"}
      onSubmit={handleSalvar}
    >
      <div className="space-y-2">
        <Label htmlFor="nome" className="text-slate-700">Nome Completo</Label>
        <Input
          id="nome"
          placeholder="Ex: Alex Sanchez"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          disabled={isSubmitting}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">E-mail Institucional</Label>
        <Input
          id="email"
          type="email"
          placeholder="Ex: alex@senac.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-slate-700">Curso Vinculado</Label>
          <Select value={cursoId} onValueChange={setCursoId} required disabled={isSubmitting}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione o curso" />
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

        <div className="space-y-2">
          <Label className="text-slate-700">Status Inicial</Label>
          <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
        <p className="text-xs text-blue-700">
          <strong>Nota:</strong> A senha de acesso padrão para novos coordenadores é <strong>123</strong>.
        </p>
      </div>
    </ModalBase>
  );
}