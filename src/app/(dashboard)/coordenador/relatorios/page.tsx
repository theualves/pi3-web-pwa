"use client";

import { useState, useEffect } from "react";
import { KpiCard } from "@/components/KpiCard";
import { CheckCircle2, Clock, ListTodo, Loader2 } from "lucide-react";
import { DashboardCharts } from "@/components/DashboardCharts";
import { api } from "@/lib/api";

export default function RelatoriosCoordenador() {
  const [carregando, setCarregando] = useState(true);
  const [kpis, setKpis] = useState({
    pendentes: 0,
    avaliadas: 0,
    horasValidadas: 0,
  });
  
  const [graficoAtividades, setGraficoAtividades] = useState<any[]>([]);
  const [graficoMeses, setGraficoMeses] = useState<any[]>([]);
  const [graficoStatus, setGraficoStatus] = useState<any[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        const res = await api("/api/atividades");
        
        if (!res.ok) throw new Error("Erro ao carregar atividades");
        
        const dados = await res.json();
        const atividades = Array.isArray(dados) ? dados : dados.atividades || [];

        const pendentes = atividades.filter((a: any) => a.status === "PENDENTE").length;
        const aprovadas = atividades.filter((a: any) => a.status === "APROVADA");
        const rejeitadas = atividades.filter((a: any) => a.status === "REJEITADA").length;
        
        const horasValidadas = aprovadas.reduce((acc: number, a: any) => acc + (a.horasAprovadas || 0), 0);

        setKpis({
          pendentes,
          avaliadas: aprovadas.length + rejeitadas,
          horasValidadas,
        });

        setGraficoStatus([
          { name: "Aprovadas", value: aprovadas.length, color: "#10B981" },
          { name: "Pendentes", value: pendentes, color: "#F59E0B" },
          { name: "Rejeitadas", value: rejeitadas, color: "#EF4444" },
        ].filter(item => item.value > 0)); 

        const categoriasMap = { ENSINO: 0, PESQUISA: 0, EXTENSAO: 0 };
        aprovadas.forEach((a: any) => {
          const cat = a.categoria as keyof typeof categoriasMap;
          if (categoriasMap[cat] !== undefined) {
            categoriasMap[cat] += (a.horasAprovadas || 0);
          }
        });
        setGraficoAtividades([
          { nome: "Ensino", horas: categoriasMap.ENSINO },
          { nome: "Pesquisa", horas: categoriasMap.PESQUISA },
          { nome: "Extensão", horas: categoriasMap.EXTENSAO },
        ]);

        const mesesMap: Record<string, number> = {};
        atividades.forEach((a: any) => {
          if (!a.createdAt) return;
          const data = new Date(a.createdAt);
          const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
          mesesMap[mes] = (mesesMap[mes] || 0) + 1;
        });

        const ordemMeses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        const evolucaoArray = Object.keys(mesesMap)
          .sort((a, b) => ordemMeses.indexOf(a) - ordemMeses.indexOf(b))
          .map(mes => ({
            mes: mes.charAt(0).toUpperCase() + mes.slice(1), 
            envios: mesesMap[mes]
          }));
          
        setGraficoMeses(evolucaoArray);

      } catch (error) {
        console.error("Erro ao montar relatórios do coordenador:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Relatórios e Estatísticas
        </h1>
      </div>

      {carregando ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 mt-4">
          <Loader2 className="size-8 animate-spin text-[#F28322] mb-3" />
          <p className="text-slate-500 font-medium">Renderizando gráficos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <KpiCard
              title="Aguardando Análise"
              value={kpis.pendentes.toString()}
              icon={Clock}
              bgClass="bg-[#F28322]"
              description="Fila de trabalho atual"
            />

            <KpiCard
              title="Atividades Avaliadas"
              value={kpis.avaliadas.toString()}
              icon={ListTodo}
              bgClass="bg-[#F28322]"
              description="Histórico de produtividade"
            />

            <KpiCard
              title="Horas Validadas"
              value={kpis.horasValidadas.toString()}
              icon={CheckCircle2}
              bgClass="bg-[#F28322]"
              description="Aprovadas aos estudantes"
            />
          </div>

          <DashboardCharts
            dadosAtividades={graficoAtividades}
            dadosMeses={graficoMeses}
            dadosStatus={graficoStatus}
          />
        </>
      )}
    </div>
  );
}