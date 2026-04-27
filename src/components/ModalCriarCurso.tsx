"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

interface ModalCriarCursoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalCriarCurso({ isOpen, onClose }: ModalCriarCursoProps) {
  // Estados para simular o preenchimento do formulário
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [horas, setHoras] = useState("");
  const [status, setStatus] = useState("Ativo");

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Criamos o objeto com os nomes de campos que o seu backend espera
    const dadosParaEnviar = {
      nome: nome,
      tipo: tipo,
      horas: horas, // O backend vai fazer o parseInt lá
      status: status,
    };

    try {
      // 2. Fazemos a chamada real para a porta 3001
      const response = await fetch("http://localhost:3001/api/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (response.ok) {
        const resultado = await response.json();
        console.log("Sucesso ao salvar no Postgres:", resultado);

        alert("Curso cadastrado com sucesso no banco de dados!");

        // 3. Limpa o formulário e fecha o modal
        setNome("");
        setTipo("");
        setHoras("");
        setStatus("Ativo");
        onClose();

        // Opcional: Recarregar a página para ver o novo curso (por enquanto)
        window.location.reload();
      } else {
        const erro = await response.json();
        alert(`Erro do servidor: ${erro.error}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert(
        "Não foi possível conectar ao backend. Verifique se o server.js está rodando!",
      );
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-[#004A8D]">
            <BookPlus className="h-6 w-6" />
            Cadastrar Novo Curso
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Preencha os dados abaixo para registrar um novo programa acadêmico
            na instituição.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-criar-curso"
          onSubmit={handleSalvar}
          className="grid gap-6 py-4"
        >
          {/* Campo: Nome do Curso */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-slate-700">
              Nome do Curso <span className="text-red-500">*</span>
            </Label>
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
            {/* Campo: Tipo do Curso */}
            <div className="space-y-2">
              <Label className="text-slate-700">
                Tipo de Formação <span className="text-red-500">*</span>
              </Label>
              <Select value={tipo} onValueChange={setTipo} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tecnólogo">Tecnólogo</SelectItem>
                  <SelectItem value="Bacharelado">Bacharelado</SelectItem>
                  <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                  <SelectItem value="Especialização">Especialização</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campo: Meta de Horas */}
            <div className="space-y-2">
              <Label htmlFor="horas" className="text-slate-700">
                Meta de Horas (Extensão) <span className="text-red-500">*</span>
              </Label>
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

          {/* Campo: Status Inicial */}
          <div className="space-y-2">
            <Label className="text-slate-700">Status Inicial</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">
                  Ativo (Permite matrículas)
                </SelectItem>
                <SelectItem value="Inativo">
                  Inativo (Apenas planejamento)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter className="flex justify-between sm:justify-between w-full border-t border-slate-100 pt-4 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-slate-500"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form="form-criar-curso"
            className="bg-[#F28322] hover:bg-[#D9751E] text-white"
          >
            Salvar Curso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
