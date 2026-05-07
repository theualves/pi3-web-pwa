"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, FileEdit, UploadCloud } from "lucide-react";

interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  atividade: any | null;
  onSuccess: () => void; // Função para recarregar a tabela depois de salvar
}

export function ModalEditarAtividade({ isOpen, onClose, atividade, onSuccess }: ModalEditarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "",
    cargaHoraria: "",
    dataInicio: "",
    descricao: "",
  });
  const [arquivo, setArquivo] = useState<File | null>(null);

  // Preenche o formulário quando o modal abre com a atividade selecionada
  useEffect(() => {
    if (atividade) {
      setFormData({
        titulo: atividade.titulo || "",
        categoria: atividade.categoria || "",
        cargaHoraria: atividade.cargaHoraria?.toString() || "",
        // Converte a data do banco (2026-05-10T00:00:00Z) para o formato do input type="date" (YYYY-MM-DD)
        dataInicio: atividade.dataInicio ? atividade.dataInicio.split('T')[0] : "",
        descricao: atividade.descricao || "",
      });
      setArquivo(null); // Reseta o arquivo novo
    }
  }, [atividade]);

  if (!atividade) return null;

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const usuarioStorage = localStorage.getItem("usuarioLogado");
      const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
      const alunoId = usuario?.idAluno || usuario?.aluno?.id || usuario?.id;

      // Monta o pacote de envio (FormData para suportar arquivo novo, se houver)
      const data = new FormData();
      data.append("titulo", formData.titulo);
      data.append("categoria", formData.categoria);
      data.append("cargaHoraria", formData.cargaHoraria);
      data.append("dataInicio", formData.dataInicio);
      data.append("descricao", formData.descricao);
      if (arquivo) {
        data.append("comprovante", arquivo);
      }

      // Rota com ID do aluno e ID da atividade
      const url = `https://api-horas-complementares.onrender.com/api/aluno-portal/${alunoId}/solicitacoes/${atividade.id}`;

      const response = await fetch(url, {
        method: "PUT", // ⚠️ Confirme se seu backend espera PUT ou PATCH para edição
        body: data,
      });

      if (!response.ok) throw new Error("Erro ao salvar alterações");

      alert("Atividade atualizada com sucesso e reenviada para análise!");
      onSuccess(); // Recarrega a tabela na página principal
      onClose();   // Fecha o modal

    } catch (error) {
      console.error(error);
      alert("Erro ao editar atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-[#004A8D]">
            <FileEdit className="h-6 w-6" />
            Corrigir Atividade
          </DialogTitle>
        </DialogHeader>

        {/* FEEDBACK DO COORDENADOR: Mostra o que o aluno errou */}
        {atividade.motivoRecusa && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md mt-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-sm mb-1">
              <AlertCircle className="w-4 h-4" />
              Motivo da Recusa (Ajuste Necessário):
            </div>
            <p className="text-sm text-red-700">{atividade.motivoRecusa}</p>
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título da Atividade</label>
              <Input 
                required 
                value={formData.titulo} 
                onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <select 
                required 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.categoria} 
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              >
                <option value="">Selecione...</option>
                <option value="ENSINO">Ensino</option>
                <option value="PESQUISA">Pesquisa</option>
                <option value="EXTENSAO">Extensão</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Realização</label>
              <Input 
                type="date" 
                required 
                value={formData.dataInicio} 
                onChange={(e) => setFormData({...formData, dataInicio: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Carga Horária</label>
              <Input 
                type="number" 
                required 
                value={formData.cargaHoraria} 
                onChange={(e) => setFormData({...formData, cargaHoraria: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição detalhada</label>
            <Textarea 
              required 
              className="resize-none" 
              value={formData.descricao} 
              onChange={(e) => setFormData({...formData, descricao: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Novo Comprovante (Opcional)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50">
              <UploadCloud className="h-6 w-6 text-slate-400 mb-2" />
              <span className="text-xs text-slate-500 mb-2 text-center">
                Só envie um arquivo novo se o antigo foi recusado. <br/> 
                <a href={`http://localhost:3001/${atividade.comprovante}`} target="_blank" className="text-blue-500 underline">Ver arquivo atual</a>
              </span>
              <Input 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg" 
                className="max-w-[250px] text-xs cursor-pointer"
                onChange={(e) => setArquivo(e.target.files ? e.target.files[0] : null)} 
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
            <Button type="submit" className="bg-[#004A8D] hover:bg-[#003666]" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}