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
  const [mostrarZonaPerigo, setMostrarZonaPerigo] = useState(false);

  useEffect(() => {
    if (isOpen && turma) {
      setNome(turma.nome);
      setPeriodo(turma.periodo?.toString() || "1");
      setConfirmacaoNome(""); 
      setMostrarZonaPerigo(false); 
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
        {/* 👉 Ajuste 1: Grid responsivo (1 coluna no celular, 2 no PC) */}
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
          /* 👉 Ajuste 2: Container relativo e padding responsivo */
          <div className="mt-6 pt-4 border-t border-red-100 flex flex-col gap-4 bg-red-50 p-3 sm:p-4 rounded-md animate-in fade-in slide-in-from-top-2 relative">
            
            {/* 👉 Ajuste 3: Botão 'X' absoluto para não amassar o texto no celular */}
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

            {/* pr-8 garante que o texto não passe por baixo do 'X' */}
            <div className="pr-8">
              <h4 className="text-sm font-semibold text-red-800">Zona de Perigo</h4>
              <p className="text-xs text-red-600 mt-1">
                Esta ação é permanente e deixará os alunos desta turma sem vínculo.
              </p>
            </div>

            <div className="space-y-2">
              {/* 👉 Ajuste 4: leading-relaxed e inline-block para o nome da turma quebrar linha sem estragar o fundo */}
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

            {/* 👉 Ajuste 5: h-auto e whitespace-normal caso o texto do botão precise de 2 linhas em celulares muito pequenos */}
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