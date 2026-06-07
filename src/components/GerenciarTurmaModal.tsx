"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalBase } from "@/components/ModalBase";
import { api } from "@/lib/api";
import { Settings, Trash2, X } from "lucide-react";
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
  
  // 👉 NOVO: Estado para esconder/mostrar a área de exclusão
  const [mostrarZonaPerigo, setMostrarZonaPerigo] = useState(false);

  useEffect(() => {
    if (isOpen && turma) {
      setNome(turma.nome);
      setPeriodo(turma.periodo?.toString() || "1");
      setConfirmacaoNome(""); 
      setMostrarZonaPerigo(false); // 👉 Esconde a zona de perigo toda vez que o modal abre
    }
  }, [isOpen, turma]);

  const handleAtualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

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
        <div className="grid grid-cols-2 gap-4">
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

        {/* 👉 CONTROLE CONDICIONAL DA ZONA DE PERIGO */}
        {!mostrarZonaPerigo ? (
          // Botão Inicial (Discreto, não atrai tanta atenção)
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMostrarZonaPerigo(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              disabled={isSubmitting}
            >
              <Trash2 className="size-4 mr-2" />
              Apagar turma
            </Button>
          </div>
        ) : (
          // A Zona de Perigo Expandida
          <div className="mt-6 pt-4 border-t border-red-100 flex flex-col gap-4 bg-red-50 p-4 rounded-md animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-semibold text-red-800">Zona de Perigo</h4>
                <p className="text-xs text-red-600 mt-1">
                  Esta ação é permanente e deixará os alunos desta turma sem vínculo.
                </p>
              </div>
              {/* Botão de Cancelar (Voltar) */}
              <button 
                type="button" 
                onClick={() => {
                  setMostrarZonaPerigo(false);
                  setConfirmacaoNome("");
                }}
                className="text-red-400 hover:text-red-700 transition-colors p-1"
                title="Cancelar exclusão"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmar-exclusao" className="text-xs font-medium text-red-700">
                Para confirmar, digite <span className="font-bold bg-red-100 px-1 py-0.5 rounded text-red-900 select-none">{turma?.nome}</span> abaixo:
              </Label>
              <Input
                id="confirmar-exclusao"
                placeholder="Digite o nome exato da turma"
                value={confirmacaoNome}
                onChange={(e) => setConfirmacaoNome(e.target.value)}
                disabled={isSubmitting || isDeleting}
                className="h-10 border-red-200 focus-visible:ring-red-500 bg-white text-slate-800"
                autoComplete="off"
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              onClick={handleExcluir}
              disabled={isSubmitting || isDeleting || confirmacaoNome !== turma?.nome}
              className="w-full h-11"
            >
              <Trash2 className="size-4 mr-2" />
              {isDeleting ? "Excluindo..." : "Estou ciente, excluir esta turma"}
            </Button>
          </div>
        )}
      </div>
    </ModalBase>
  );
}