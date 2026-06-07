"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalBase } from "@/components/ModalBase";
import { IconeSenac } from "./IconeSenac";
import { api } from "@/lib/api";

interface NovoEstudanteModalProps {
  isOpen: boolean;
  onClose: (sucesso?: boolean) => void;
  turmaIdPreSelecionada?: string;
}

export function NovoEstudanteModal({
  isOpen,
  onClose,
  turmaIdPreSelecionada,
}: NovoEstudanteModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [cursoId, setCursoId] = useState("");

  const [turmaId, setTurmaId] = useState<string | undefined>(undefined);
  const [periodo, setPeriodo] = useState("");

  const [cursos, setCursos] = useState<any[]>([]);
  const [turmas, setTurmas] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTurmaPreSelecionada =
    typeof turmaIdPreSelecionada === "string" &&
    turmaIdPreSelecionada.trim() !== "";

  const aplicarMascaraCpf = (valor: string) => {
    let v = valor.replace(/\D/g, ""); 
    
    if (v.length > 11) v = v.substring(0, 11);

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    
    setCpf(v);
  };

  useEffect(() => {
    if (isOpen) {
      const storage = localStorage.getItem("usuarioLogado");
      const usuarioLogado = storage ? JSON.parse(storage) : null;
      const coordenadorId = usuarioLogado?.id;

      if (!coordenadorId) return;

      const urlCursos = `/api/cursos?coordenadorId=${coordenadorId}`;

      api(urlCursos)
        .then((res) => res.json())
        .then((data) => {
          setCursos(data);
          if (data && data.length > 0) {
            setCursoId(data[0].id);
          }
        })
        .catch((err) => console.error("Erro ao buscar cursos:", err));
    } else {
      setNome("");
      setEmail("");
      setSenha("");
      setCpf("");
      setTurmaId(undefined);
      setPeriodo("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (cursoId) {
      api(`/api/turmas?cursoId=${cursoId}`)
        .then((res) => res.json())
        .then((data) => {
          setTurmas(data);

          if (isTurmaPreSelecionada) {
            setTurmaId(turmaIdPreSelecionada);

            const turmaEncontrada = data.find(
              (t: any) => t.id === turmaIdPreSelecionada,
            );
            if (turmaEncontrada && turmaEncontrada.periodo) {
              setPeriodo(String(turmaEncontrada.periodo));
            }
          } else {
            setTurmaId(undefined);
          }
        })
        .catch((err) => console.error("Erro ao carregar turmas:", err));
    } else {
      setTurmas([]);
    }
  }, [cursoId, isTurmaPreSelecionada, turmaIdPreSelecionada]);

  const handleTurmaChange = (novoTurmaId: string) => {
    setTurmaId(novoTurmaId);

    if (novoTurmaId === "sem-turma") {
      setPeriodo(""); 
      return;
    }

    const turmaSelecionada = turmas.find((t) => t.id === novoTurmaId);
    if (turmaSelecionada && turmaSelecionada.periodo) {
      setPeriodo(String(turmaSelecionada.periodo));
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha || !cpf || !cursoId || !periodo) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nome,
      email,
      senha,
      cpf: cpf.replace(/\D/g, ""), // Continua limpando perfeitamente para o backend
      cursoId,
      turmaId: turmaId === "sem-turma" ? undefined : turmaId,
      periodo: parseInt(periodo, 10),
    };

    try {
      const response = await api( 
        "/api/aluno-coordenador",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const erroBackend = await response.json();
        if (erroBackend.detalhes) {
          const mensagens = Object.values(erroBackend.detalhes)
            .flat()
            .join("\n• ");
          alert(`Corrija os seguintes dados:\n\n• ${mensagens}`);
        } else if (erroBackend.erro || erroBackend.error) {
          alert(`Atenção: ${erroBackend.erro || erroBackend.error}`);
        } else {
          alert(
            "Erro ao cadastrar aluno. Verifique os dados e tente novamente.",
          );
        }
        setIsSubmitting(false);
        return;
      }

      onClose(true);
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title="Cadastrar aluno"
      description="Preencha os dados abaixo para registrar um novo estudante no sistema."
      icon={<IconeSenac className="h-12 w-12 text-[#004A8D]" />}
      submitText={isSubmitting ? "Cadastrando..." : "Cadastrar"}
      onSubmit={handleSalvar}
    >
      <div className="space-y-4">
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-slate-700">
              CPF
            </Label>
            <Input
              id="cpf"
              value={cpf}
              onChange={(e) => aplicarMascaraCpf(e.target.value)}
              maxLength={14}
              placeholder="000.000.000-00"
              required
              disabled={isSubmitting}
              className="h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-700">Curso Vinculado</Label>
            <Select
              value={cursoId}
              onValueChange={setCursoId}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger className="h-11 w-full overflow-hidden">
                <span className="truncate block text-left w-full pr-4">
                  <SelectValue
                    placeholder={
                      cursos.length > 0 ? "Selecione o curso" : "Carregando..."
                    }
                  />
                </span>
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
            <Label className="text-slate-700">Turma (Opcional)</Label>
            <Select
              value={turmaId || undefined}
              onValueChange={handleTurmaChange}
              disabled={isSubmitting || isTurmaPreSelecionada}
            >
              <SelectTrigger className="h-11 w-full overflow-hidden bg-white disabled:bg-slate-50 disabled:opacity-80">
                <span className="truncate block text-left w-full pr-4">
                  <SelectValue
                    placeholder={
                      turmas.length > 0
                        ? "Selecione a turma"
                        : "Carregando turmas..."
                    }
                  />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sem-turma" className="text-slate-400 italic">
                  Deixar sem turma
                </SelectItem>
                {turmas.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
              disabled={
                isSubmitting ||
                (turmaId !== "sem-turma" &&
                  turmaId !== undefined &&
                  turmas.find((t) => t.id === turmaId)?.periodo != null)
              }
              className="h-11 disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
          <div></div>
        </div>
      </div>
    </ModalBase>
  );
}