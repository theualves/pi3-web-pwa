"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalBase } from "@/components/ModalBase";
import { api } from "@/lib/api";
import { Settings, Trash2, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GerenciarTurmaModalProps {
  isOpen: boolean;
  turma: any;
  onClose: (sucesso?: boolean) => void;
}

export function GerenciarTurmaModal({ isOpen, turma, onClose }: GerenciarTurmaModalProps) {
  const [nome, setNome] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [confirmacaoNome, setConfirmacaoNome] = useState("");
  const [mostrarZonaPerigo, setMostrarZonaPerigo] = useState(false);

  // 👉 NOVO: Estado para a trava de edição
  const [cienteAlteracao, setCienteAlteracao] = useState(false);
  
  // 👉 Verifica automaticamente se o nome digitado é diferente do original
  const nomeAlterado = turma && nome.trim() !== turma.nome;

  useEffect(() => {
    if (isOpen && turma) {
      setNome(turma.nome);
      setPeriodo(turma.periodo?.toString() || "1");
      setConfirmacaoNome(""); 
      setMostrarZonaPerigo(false); 
      setCienteAlteracao(false); // Reseta a trava ao abrir
    }
  }, [isOpen, turma]);

  const handleAtualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

    // 👉 NOVO: Trava a submissão se o nome mudou mas ele não marcou o checkbox
    if (nomeAlterado && !cienteAlteracao) {
      alert("Por favor, marque a caixa de confirmação para alterar o nome da turma.");
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      nome,
      periodo: parseInt(periodo, 10),
      cursoId: turma.cursoId,
    };

    try {
      const response = await api(`/api/turmas/${turma.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const erroBackend = await response.json();
        alert(`Erro: ${erroBackend.erro || "Não foi possível atualizar."}`);
        return;
      }

      onClose(true); 
    } catch (error) {
      console.error(error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcluir = async () => {
    if (confirmacaoNome !== turma.nome) return;

    setIsDeleting(true);
    try {
      const response = await api(`/api/turmas/${turma.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir");

      onClose(true); 
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir a turma.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title="Gerenciar Turma"
      description="Atualize as informações ou exclua esta turma do sistema."
      icon={<Settings className="h-12 w-12 text-[#004A8D]" />}
      submitText={isSubmitting ? "Salvando..." : "Salvar Alterações"}
      onSubmit={handleAtualizar}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nome" className="text-slate-700">Nome da Turma</Label>
            <Input
              id="edit-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={isSubmitting || isDeleting}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-periodo" className="text-slate-700">Período Atual</Label>
            <Input
              id="edit-periodo"
              type="number"
              min="1"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              required
              disabled={isSubmitting || isDeleting}
              className="h-11"
            />
          </div>
        </div>

        {/* 👉 NOVO: Zona de Atenção (Aparece apenas se ele digitar um nome diferente) */}
        {nomeAlterado && (
          <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-md animate-in fade-in slide-in-from-top-2">
            <div className="flex gap-3">
              <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800">Atenção à mudança de nome</h4>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Você está alterando o nome de <strong className="bg-amber-100 px-1 rounded">{turma.nome}</strong> para <strong className="bg-amber-100 px-1 rounded">{nome}</strong>. Esta alteração será refletida no portal de todos os estudantes vinculados a ela.
                </p>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={cienteAlteracao}
                    onChange={(e) => setCienteAlteracao(e.target.checked)}
                    disabled={isSubmitting || isDeleting}
                    className="size-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <span className="text-sm font-semibold text-amber-900 select-none">
                    Estou ciente e confirmo a alteração
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {!mostrarZonaPerigo ? (
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMostrarZonaPerigo(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
            >
              <Trash2 className="size-4 mr-2" />
              Apagar turma
            </Button>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-red-100 flex flex-col gap-4 bg-red-50 p-3 sm:p-4 rounded-md animate-in fade-in slide-in-from-top-2 relative">
            <button 
              type="button" 
              onClick={() => {
                setMostrarZonaPerigo(false);
                setConfirmacaoNome("");
              }}
              className="absolute top-2 right-2 text-red-400 hover:text-red-700 hover:bg-red-100 transition-colors p-1.5 rounded-md"
              title="Cancelar exclusão"
            >
              <X className="size-5" />
            </button>

            <div className="pr-8">
              <h4 className="text-sm font-semibold text-red-800">Zona de Perigo</h4>
              <p className="text-xs text-red-600 mt-1">
                Esta ação é permanente e deixará os alunos desta turma sem vínculo.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmar-exclusao" className="text-xs font-medium text-red-700 block leading-relaxed">
                Para confirmar, digite <span className="font-bold bg-red-100 px-1.5 py-0.5 rounded text-red-900 mx-1 inline-block">{turma?.nome}</span> abaixo:
              </Label>
              <Input
                id="confirmar-exclusao"
                placeholder="Nome da turma"
                value={confirmacaoNome}
                onChange={(e) => setConfirmacaoNome(e.target.value)}
                disabled={isSubmitting || isDeleting}
                className="h-11 border-red-200 focus-visible:ring-red-500 bg-white text-slate-800"
                autoComplete="off"
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={handleExcluir}
              disabled={isSubmitting || isDeleting || confirmacaoNome !== turma?.nome}
              className="w-full min-h-[44px] h-auto py-2 whitespace-normal text-center"
            >
              <Trash2 className="size-4 mr-2 shrink-0" />
              <span>{isDeleting ? "Excluindo..." : "Estou ciente, excluir esta turma"}</span>
            </Button>
          </div>
        )}
      </div>
    </ModalBase>
  );
}