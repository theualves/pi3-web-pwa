"use client";

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
import { FileText, User, Calendar, Clock } from "lucide-react";

interface ValidarAtividadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  atividade: any | null;
}

export function ValidarAtividadeModal({ isOpen, onClose, atividade }: ValidarAtividadeModalProps) {
  if (!atividade) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-[#004A8D]">
            <FileText className="h-6 w-6" />
            Análise de Atividade Complementar
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Estudante</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="h-4 w-4 text-slate-400" />
                {atividade.estudante || "Nome não informado"}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Categoria / Horas</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock className="h-4 w-4 text-slate-400" />
                {atividade.categoriaCarga || `${atividade.categoria} - ${atividade.cargaHoraria}h`}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Período Letivo</span>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400" />
                {atividade.periodo || "Não informado"}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Status Atual</span>
              <div>
                <Badge variant={atividade.status === "Aprovado" ? "default" : "secondary"} className="bg-amber-100 text-amber-800 border-none">
                  {atividade.status || "Pendente"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700">Descrição do Estudante</h4>
            <div className="p-3 bg-white border border-slate-200 rounded-md text-sm text-slate-600 min-h-[80px]">
              {atividade.descricao || "Descrição da atividade enviada pelo aluno..."}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-700">Parecer do Coordenador <span className="text-red-500">*</span></h4>
            <Textarea 
              placeholder="Digite o seu feedback ou a justificativa em caso de recusa..." 
              className="resize-none h-24"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between w-full border-t border-slate-100 pt-4">
          <Button variant="outline" onClick={onClose} className="text-slate-500">
            Cancelar
          </Button>
          
          <div className="flex gap-2">
            <Button variant="destructive" onClick={onClose}>Recusar</Button>
            <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50" onClick={onClose}>
              Pedir Ajuste
            </Button>
            <Button className="bg-[#004A8D] hover:bg-[#003666] text-white" onClick={onClose}>
              Aprovar Horas
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}