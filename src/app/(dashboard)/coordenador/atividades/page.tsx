import { buscarAtividadesRecentes } from "@/services/atividadesService";
import { TabelaAtividadesClient } from "@/components/TabelaAtividadesClient";

export default async function AtividadesPage() {
  const atividadesAPI = await buscarAtividadesRecentes();

  const dadosFormatados = atividadesAPI.map((atividade) => ({
    ...atividade,
    categoriaCarga: `${atividade.categoria} (${atividade.cargaHoraria}h)`,
  }));

  return (
      <div className="">
        <TabelaAtividadesClient dadosIniciais={dadosFormatados} />
      </div>
  );
}