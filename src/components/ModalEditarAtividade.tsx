"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, UploadCloud, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { IconeSenac } from "@/components/IconeSenac";

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  atividade: any | null;
  onSuccess: () => void;
}

export function ModalEditarAtividade({
  isOpen,
  onClose,
  atividade,
  onSuccess,
}: ModalEditarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [baixandoArquivo, setBaixandoArquivo] = useState(false); // 👉 Novo estado para o botão de arquivo
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    cargaHoraria: "",
    dataInicio: "",
    descricao: "",
  });
  const [arquivo, setArquivo] = useState<File | null>(null);

  useEffect(() => {
    if (atividade) {
      setFormData({
        titulo: atividade.titulo || "",
        categoria: atividade.categoria || "",
        cargaHoraria: atividade.cargaHoraria?.toString() || "",
        dataInicio: atividade.dataInicio
          ? atividade.dataInicio.split("T")[0]
          : "",
        descricao: atividade.descricao || "",
      });
      setArquivo(null);
    }
  }, [atividade]);

  const handleBaixarComprovante = async () => {
    setBaixandoArquivo(true);
    try {
      const res = await api(`/api/atividades/${atividade.id}/comprovante/download`);

      if (!res.ok) {
        throw new Error("Erro ao carregar o comprovante do servidor.");
      }

      // Transforma a resposta em arquivo visualizável
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank"); // Abre em uma nova aba

    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar o arquivo. Ele pode ter sido removido.");
    } finally {
      setBaixandoArquivo(false);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("categoria", formData.categoria);
      data.append("cargaHoraria", formData.cargaHoraria);
      data.append("dataInicio", formData.dataInicio);
      data.append("descricao", formData.descricao);
      if (arquivo) {
        data.append("comprovante", arquivo);
      }

      const url = `/api/aluno-portal/solicitacoes/${atividade.id}`;

      const response = await api(url, {
        method: "PUT",
        body: data,
      });

      if (!response.ok) {
        const erroBackend = await response
          .json()
          .catch(() => ({ message: "Erro desconhecido do servidor" }));
        console.error("🚨 O BACKEND RECUSOU A EDIÇÃO. MOTIVO:", erroBackend);
        alert(
          `Erro do servidor: ${
            erroBackend.error || erroBackend.message || "Verifique o console"
          }`
        );
        setIsSubmitting(false);
        return;
      }

      alert("Atividade atualizada com sucesso e reenviada para análise!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão ao editar atividade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcluir = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta atividade? Essa ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const url = `/api/aluno-portal/solicitacoes/${atividade.id}`;

      const response = await api(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const erroBackend = await response
          .json()
          .catch(() => ({ message: "Erro desconhecido do servidor" }));
        console.error("🚨 O BACKEND RECUSOU A EXCLUSÃO. MOTIVO:", erroBackend);
        throw new Error(
          erroBackend.error || erroBackend.message || "Erro ao excluir"
        );
      }

      alert("Atividade excluída com sucesso!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(`Erro ao excluir: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(aberto) => {
        if (!aberto) onClose();
      }}
    >
      <DialogContent className="w-[95vw] max-w-md sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
        {atividade ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold sm:text-2xl text-[#004A8D]">
                <IconeSenac className="h-8 w-8 sm:h-10 sm:w-10 text-[#004A8D]" />
                Corrigir Atividade
              </DialogTitle>
            </DialogHeader>

            {atividade.motivoRecusa && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-r-md mt-2">
                <div className="flex items-center gap-2 text-red-800 font-bold text-xs sm:text-sm mb-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Motivo da Recusa:
                </div>
                <p className="text-xs sm:text-sm text-red-700">
                  {atividade.motivoRecusa}
                </p>
              </div>
            )}

            <form onSubmit={handleSalvar} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">
                    Título da Atividade
                  </label>
                  <Input
                    required
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">
                    Categoria
                  </label>
                  <select
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                  >
                    <option value="">Selecione...</option>
                    <option value="ENSINO">Ensino</option>
                    <option value="PESQUISA">Pesquisa</option>
                    <option value="EXTENSAO">Extensão</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">
                    Data de Realização
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.dataInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, dataInicio: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-medium">
                    Carga Horária
                  </label>
                  <Input
                    type="number"
                    required
                    value={formData.cargaHoraria}
                    onChange={(e) =>
                      setFormData({ ...formData, cargaHoraria: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium">
                  Descrição detalhada
                </label>
                <Textarea
                  required
                  className="resize-none min-h-[80px]"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium">
                  Novo Comprovante (Opcional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center bg-slate-50">
                  <UploadCloud className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 mb-2" />
                  <span className="text-[10px] sm:text-xs text-slate-500 mb-2 text-center">
                    Só envie um arquivo novo se o antigo foi recusado. <br />
                    
                    {/* 👉 Link substituído pelo botão inteligente aqui! */}
                    <button
                      type="button"
                      onClick={handleBaixarComprovante}
                      disabled={baixandoArquivo}
                      className="text-[#004A8D] font-medium hover:underline mt-1 bg-transparent border-none cursor-pointer"
                    >
                      {baixandoArquivo ? "Carregando..." : "Ver arquivo atual"}
                    </button>

                  </span>
                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="max-w-full sm:max-w-[250px] text-xs cursor-pointer"
                    onChange={(e) =>
                      setArquivo(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 border-t mt-4 flex flex-col-reverse sm:flex-row w-full justify-between gap-3 sm:gap-0 items-stretch sm:items-center">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleExcluir}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
                >
                  <Trash2 className="size-4" />
                  <span>Excluir</span>
                </Button>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#004A8D] hover:bg-[#003666] w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="p-8 text-center text-slate-500 font-medium animate-pulse">
            Preparando formulário...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}