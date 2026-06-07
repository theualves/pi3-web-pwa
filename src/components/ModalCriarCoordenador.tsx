"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModalBase } from "@/components/ModalBase";
import { IconeSenac } from "./IconeSenac";
import {api} from "@/lib/api";

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

  useEffect(() => {
    if (isOpen) {
      api("/api/cursos")
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
      senha: "123", 
      tipo: "COORDENADOR",
      cursoId: cursoId,
      status: status,
    };

    try {
      const response = await api("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar coordenador.");
      }

      setNome("");
      setEmail("");
      setCursoId("");
      setStatus("Ativo");
      
      onSuccess(); 
      onClose();  
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
      icon={<IconeSenac className="h-12 w-12 text-[#004A8D]" />}
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