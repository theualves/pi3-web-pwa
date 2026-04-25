import { buscarAtividadesRecentes } from "@/services/atividadesService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TabelaAtividadesClient } from "@/components/TabelaAtividadesClient";

export default async function AtividadesPage() {
  const atividadesAPI = await buscarAtividadesRecentes();

  // Mapeando e garantindo que o resto dos dados (...atividade) passe adiante
  const dadosFormatados = atividadesAPI.map((atividade) => ({
    ...atividade,
    categoriaCarga: `${atividade.categoria} (${atividade.cargaHoraria}h)`,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Atividades enviadas
          </h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Buscar uma atividade</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Validar uma atividade</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <TabelaAtividadesClient dadosIniciais={dadosFormatados} />
      </div>
    </div>
  );
}