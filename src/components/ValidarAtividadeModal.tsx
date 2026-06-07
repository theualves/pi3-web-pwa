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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, User, Calendar, Clock, CheckCircle } from "lucide-react";
import { api} from "@/lib/api";

interface ValidarAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  atividade: any | null;
  onSuccess: () => void; 
}

export function ValidarAtividadeModal({ 
  isOpen, 
  onClose, 
  atividade, 
  onSuccess 
}: ValidarAtividadeModalProps) {
  const [motivo, setMotivo] = useState("");
  const [horasAprovadas, setHorasAprovadas] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (atividade) {
      setHorasAprovadas(atividade.horasSolicitadas?.toString() || "0");
      setMotivo(""); 
    }
  }, [atividade]);

  if (!atividade) return null;

  const handleValidar = async (status: "APROVADA" | "REJEITADA") => {
    if (status === "REJEITADA" && !motivo.trim()) {
      alert("Para recusar ou pedir ajuste, você precisa preencher o Parecer/Motivo.");
      return;
    }

    if (status === "APROVADA" && (Number(horasAprovadas) <= 0 || isNaN(Number(horasAprovadas)))) {
      alert("Para aprovar, informe uma quantidade válida de horas.");
      return;
    }

    const usuarioStorage = localStorage.getItem("usuarioLogado");
    const usuarioLogado = usuarioStorage ? JSON.parse(usuarioStorage) : null;
    const validadorId = usuarioLogado?.id;

    if (!validadorId) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      status: status,
      horasAprovadas: status === "APROVADA" ? Number(horasAprovadas) : 0,
      motivo: status === "REJEITADA" ? motivo : null,
      validadorId: validadorId,
    };

    try {
      const url = `/api/atividades/${atividade.id}/validar`;

      const response = await api(url, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao validar atividade.");

      alert(`Atividade ${status.toLowerCase()} com sucesso!`);
      
      onSuccess(); 
      onClose();   

    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão ao tentar validar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pt-6 sm:pt-0 text-lg sm:text-lg text-[#004A8D]">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
            Análise de Atividade Complementar
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Estudante</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="h-4 w-4 text-slate-400" />
                {atividade.estudante || atividade.aluno?.usuario?.nome}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Categoria / Solicitado</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock className="h-4 w-4 text-slate-400" />
                {atividade.categoriaCarga || `${atividade.categoria} - ${atividade.horasSolicitadas}h`}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Período</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400" />
                {atividade.periodo}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Status Atual</span>
              <div>
                <Badge variant={atividade.status === "APROVADA" ? "default" : "secondary"}>
                  {atividade.status || "Pendente"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700">Descrição do Estudante</h4>
            <div className="p-3 bg-white border border-slate-200 rounded-md text-sm text-slate-600">
              {atividade.descricao || "Sem descrição."}
            </div>
          </div>

          {atividade.comprovante && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Comprovante</h4>
              <a 
                href={`https://api-horas-complementares.onrender.com/${atividade.comprovante}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <FileText className="h-4 w-4" /> Ver arquivo anexo
              </a>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div className="col-span-1 space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Horas a Aprovar</h4>
              <Input 
                type="number" 
                value={horasAprovadas}
                onChange={(e) => setHorasAprovadas(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Parecer / Motivo</h4>
              <Textarea 
                placeholder="Obrigatório para recusas..." 
                className="h-16"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:justify-between w-full border-t border-slate-100 pt-4">
          <Button variant="outline" onClick={onClose} className="mt-4 my-2 sm:mt-0 sm:my-0 text-slate-500">
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleValidar("REJEITADA")}
            disabled={isSubmitting}
          >
            Recusar
          </Button>
          <Button 
            className="bg-[#004A8D] hover:bg-[#003666] text-white"
            onClick={() => handleValidar("APROVADA")}
            disabled={isSubmitting}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}