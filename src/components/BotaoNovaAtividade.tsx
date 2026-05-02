"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import ModalNovaAtividade from "@/components/ModalNovaAtividade";

export function BotaoNovaAtividade() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <Button
        className="bg-[#004A8D] hover:bg-[#003666] text-white flex items-center gap-2 w-full sm:w-auto"
        onClick={() => setModalAberto(true)}
      >
        <Plus className="size-4" />
        Adicionar nova atividade
      </Button>

      <ModalNovaAtividade
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
      />
    </>
  );
}
