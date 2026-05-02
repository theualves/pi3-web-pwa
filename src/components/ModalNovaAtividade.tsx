"use client";

import { ModalBase } from "@/components/ModalBase";
import { useState } from "react";
import { BookPlus, Paperclip } from "lucide-react"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconeSenac } from "./IconeSenac";

interface ModalNovaAtividadeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalNovaAtividade({
  isOpen,
  onClose,
}: ModalNovaAtividadeProps) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setArquivo(null);
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert("O arquivo é muito grande! O limite máximo é 10MB.");
      e.target.value = "";
      setArquivo(null);
      return;
    }
    setArquivo(file);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("categoria", categoria);
    formData.append("dataInicio", dataInicio);
    formData.append("cargaHoraria", cargaHoraria);
    formData.append("descricao", descricao);

    if (arquivo) {
      formData.append("certificado", arquivo);
    }

    console.log("Dados empacotados para o backend:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    onClose();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar nova atividade"
      description="Preencha os dados e anexe o certificado para validação."
      icon={<IconeSenac className="h-6 w-6 text-[#004A8D]" />}
      submitText="Cadastrar"
      onSubmit={handleSalvar}
    >
      <div className="flex flex-col gap-5 pt-2">
        {/* BLOCO 1: Informações Gerais */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="nome"
              className="text-sm font-medium text-slate-700"
            >
              Nome da Atividade
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="h-10"
              placeholder="Ex: Curso de Lógica..."
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="categoria"
              className="text-sm font-medium text-slate-700"
            >
              Categoria
            </Label>
            <Input
              id="categoria"
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className="h-10"
              placeholder="Ex: Extensão"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="dataInicio"
                className="text-sm font-medium text-slate-700"
              >
                Data de Início
              </Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
                className="h-10 text-slate-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="ch"
                className="text-sm font-medium text-slate-700"
              >
                Carga Horária (h)
              </Label>
              <Input
                id="ch"
                type="number"
                min="1"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(e.target.value)}
                required
                className="h-10"
                placeholder="Ex: 40"
              />
            </div>
          </div>
        </div>

        {/* DIVISOR SUTIL */}
        <hr className="border-slate-100" />

        {/* BLOCO 2: Anexos e Descrição */}
        <div className="flex flex-col gap-4">
          {/* Caixa de Upload Estilizada */}
          <div className="space-y-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <Paperclip className="size-4 text-slate-500" />
              <Label
                htmlFor="arquivo"
                className="text-sm font-medium text-slate-700"
              >
                Anexar Certificado
              </Label>
            </div>
            <Input
              id="arquivo"
              type="file"
              accept=".pdf, image/jpeg, image/png, image/jpg"
              onChange={handleArquivoChange}
              required
              className="h-10 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-[#004A8D] hover:file:bg-blue-200 cursor-pointer text-slate-600 shadow-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Formatos aceitos: PDF, JPG ou PNG. Máximo 10MB.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="descricao"
              className="text-sm font-medium text-slate-700"
            >
              Descrição
            </Label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              placeholder="Descreva brevemente as atividades realizadas..."
              className="flex w-full min-h-[90px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004A8D] focus-visible:ring-offset-2 resize-none shadow-sm"
            />
          </div>
        </div>
      </div>
    </ModalBase>
  );
}
