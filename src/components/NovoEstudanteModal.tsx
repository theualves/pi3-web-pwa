"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookPlus } from "lucide-react";
import { ModalBase } from "@/components/ModalBase";

interface NovoEstudanteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovoEstudanteModal({
  isOpen,
  onClose,
}: NovoEstudanteModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState(""); // Novo campo
  const [cpf, setCpf] = useState("");
  const [cursoId, setCursoId] = useState(""); // Trocado de curso para cursoId
  const [periodo, setPeriodo] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha || !cpf || !cursoId || !periodo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);

    // 1. Montando o pacote EXATAMENTE como o backend pediu
    const payload = {
      nome: nome,
      email: email,
      senha: senha,
      cpf: cpf.replace(/\D/g, ""), // Remove formatação (pontos e traços), deixa só números
      cursoId: cursoId,
      periodo: parseInt(periodo, 10), // Converte para número inteiro (ex: "1" vira 1)
    };

    try {
      // 2. A requisição real (Substitua /api/alunos pela rota de cadastro correta do seu backend)
      const response = await fetch("http://localhost:3001/api/usuarios/aluno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erros do backend:", errorData);
        alert(
          "Erro ao cadastrar aluno. Verifique se o E-mail ou CPF já existem.",
        );
        setIsSubmitting(false);
        return;
      }

      // 3. Sucesso! Limpa o formulário e fecha o modal
      setNome("");
      setEmail("");
      setSenha("");
      setCpf("");
      setCursoId("");
      setPeriodo("");
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
      title="Cadastrar aluno"
      description="Preencha os dados abaixo para registrar um novo estudante no sistema."
      icon={<BookPlus className="h-6 w-6" />}
      submitText={isSubmitting ? "Cadastrando..." : "Cadastrar"}
      onSubmit={handleSalvar}
    >
      <div className="space-y-4">
        {/* Linha 1: Nome e Email */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-slate-700">
              Nome Completo
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={isSubmitting}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-11"
            />
          </div>
        </div>

        {/* Linha 2: Senha e CPF */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senha" className="text-slate-700">
              Senha Inicial
            </Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-11"
              placeholder="Ex: 123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-slate-700">
              CPF
            </Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-11"
              placeholder="Apenas números"
            />
          </div>
        </div>

        {/* Linha 3: Curso e Período */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-700">Curso Vinculado</Label>
            <Select
              value={cursoId}
              onValueChange={setCursoId}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {/* ID chumbado para teste com o seu payload! */}
                <SelectItem value="cb9e07c0-16fd-4fa0-a301-df34b490bf62">
                  Engenharia de Software
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodo" className="text-slate-700">
              Período
            </Label>
            <Input
              id="periodo"
              type="number"
              min="1"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-11"
              placeholder="Ex: 1"
            />
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
