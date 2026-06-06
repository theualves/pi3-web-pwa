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
import { BookPlus } from "lucide-react";
import { ModalBase } from "@/components/ModalBase";
import { IconeSenac } from "./IconeSenac";

interface NovoEstudanteModalProps {
  isOpen: boolean;
  onClose: (sucesso?: boolean) => void;
}

export function NovoEstudanteModal({
  isOpen,
  onClose,
}: NovoEstudanteModalProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [periodo, setPeriodo] = useState("");

  const [cursos, setCursos] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 1. Pegamos os dados do coordenador logado na mochila
      const storage = localStorage.getItem("usuarioLogado");
      const usuarioLogado = storage ? JSON.parse(storage) : null;

      // 2. Pegamos o ID do Coordenador (que será usado no filtro da rota)
      const coordenadorId = usuarioLogado?.id;

      if (!coordenadorId) {
        console.error("ID do coordenador não encontrado no localStorage");
        return;
      }

      // 3. Chamamos a rota específica que você passou, injetando o ID do coordenador
      const urlCursos = `https://api-horas-complementares.onrender.com/api/cursos?coordenadorId=${coordenadorId}`;

      fetch(urlCursos)
        .then((res) => res.json())
        .then((data) => {
          setCursos(data);

          // 4. Se a API retornar os cursos, e o coordenador tiver um cursoId principal,
          // já deixamos ele pré-selecionado para facilitar a vida dele.
          const idDoCursoPadrao =
            usuarioLogado?.cursoId || usuarioLogado?.usuario?.cursoId;
          if (idDoCursoPadrao) {
            setCursoId(idDoCursoPadrao);
          }
        })
        .catch((err) => console.error("Erro ao buscar cursos filtrados:", err));
    } else {
      // Limpeza ao fechar
      setNome("");
      setEmail("");
      setSenha("");
      setCpf("");
      setPeriodo("");
    }
  }, [isOpen]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha || !cpf || !cursoId || !periodo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nome: nome,
      email: email,
      senha: senha,
      cpf: cpf.replace(/\D/g, ""),
      cursoId: cursoId,
      periodo: parseInt(periodo, 10),
    };

    try {
      const response = await fetch(
        "https://api-horas-complementares.onrender.com/api/aluno-coordenador",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        // 1. Lê a resposta real que o backend enviou (o JSON do Zod)
        const erroBackend = await response.json();

        // 2. Se for um erro de validação do Zod (veio com 'detalhes')
        if (erroBackend.detalhes) {
          // Pega todas as mensagens de erro, junta em uma lista e coloca uma quebra de linha
          const mensagens = Object.values(erroBackend.detalhes)
            .flat()
            .join("\n• ");

          alert(`Corrija os seguintes dados:\n\n• ${mensagens}`);
        }
        // 3. Se for outro erro do backend (ex: "CPF já cadastrado")
        else if (erroBackend.erro || erroBackend.error) {
          alert(`Atenção: ${erroBackend.erro || erroBackend.error}`);
        }
        // 4. Fallback (se a internet cair ou o erro for desconhecido)
        else {
          alert(
            "Erro ao cadastrar aluno. Verifique os dados e tente novamente.",
          );
        }

        setIsSubmitting(false);
        return;
      }

      onClose(true); // Sucesso! Avisa a tabela para recarregar
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
              onChange={(e) => setCpf(e.target.value)}
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
            />
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
