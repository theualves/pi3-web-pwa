"use client";

import { useState, useEffect } from "react";
import { KpiCard } from "@/components/KpiCard";
import { GraduationCap, FileText, Clock, Loader2, Trophy, Activity, BookOpen } from "lucide-react";
import { api } from "@/lib/api";

export default function GestorDashboard() {
  const [carregando, setCarregando] = useState(true);
  const [metricas, setMetricas] = useState({
    totalCursos: 0,
    totalAtividades: 0,
    horasValidadas: 0,
  });
  const [rankingCoordenadores, setRankingCoordenadores] = useState<any[]>([]);
  
  // Estados simplificados e intuitivos para o Raio-X
  const [distribuicaoStatus, setDistribuicaoStatus] = useState({
    pendentes: 0,
    aprovadas: 0,
    rejeitadas: 0,
  });
  const [distribuicaoCategoria, setDistribuicaoCategoria] = useState({
    ensino: 0,
    pesquisa: 0,
    extensao: 0,
  });

  useEffect(() => {
    const carregarDashboard = async () => {
      setCarregando(true);
      try {
        const [resAtividades, resCursos] = await Promise.all([
          api("/api/atividades"), 
          api("/api/cursos"),     
        ]);

        let atividades = [];
        let cursos = [];

        if (resAtividades.ok) {
          const dadosAtiv = await resAtividades.json();
          atividades = Array.isArray(dadosAtiv) ? dadosAtiv : dadosAtiv.atividades || [];
        }

        if (resCursos.ok) {
          const dadosCursos = await resCursos.json();
          cursos = Array.isArray(dadosCursos) ? dadosCursos : dadosCursos.cursos || [];
        }

        // 1. Cálculos Base (KPIs Superiores)
        const horasTotais = atividades
          .filter((a: any) => a.status === "APROVADA")
          .reduce((acc: number, a: any) => acc + (a.horasAprovadas || 0), 0);

        setMetricas({
          totalCursos: cursos.length,
          totalAtividades: atividades.length,
          horasValidadas: horasTotais,
        });

        // 2. Raio-X: Status
        setDistribuicaoStatus({
          pendentes: atividades.filter((a: any) => a.status === "PENDENTE").length,
          aprovadas: atividades.filter((a: any) => a.status === "APROVADA").length,
          rejeitadas: atividades.filter((a: any) => a.status === "REJEITADA").length,
        });

        // 3. Raio-X: Categorias
        setDistribuicaoCategoria({
          ensino: atividades.filter((a: any) => a.categoria === "ENSINO").length,
          pesquisa: atividades.filter((a: any) => a.categoria === "PESQUISA").length,
          extensao: atividades.filter((a: any) => a.categoria === "EXTENSAO").length,
        });

        // 4. Ranking de Coordenadores
        const contagemPorCoordenador: Record<string, { nome: string; quantidade: number }> = {};
        atividades.forEach((ativ: any) => {
          if (ativ.validadaPorId && ativ.validadaPor) {
            const id = ativ.validadaPorId;
            if (!contagemPorCoordenador[id]) {
              contagemPorCoordenador[id] = {
                nome: ativ.validadaPor.nome || "Coordenador",
                quantidade: 0,
              };
            }
            contagemPorCoordenador[id].quantidade += 1;
          }
        });

        const ranking = Object.values(contagemPorCoordenador)
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, 5);

        setRankingCoordenadores(ranking);

      } catch (error) {
        console.error("Erro ao montar o dashboard:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDashboard();
  }, []);

  const calcPercent = (valor: number, total: number) => {
    return total > 0 ? Math.round((valor / total) * 100) : 0;
  };

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#004A8D]">
        <Loader2 className="size-10 animate-spin mb-4" />
        <p className="font-medium text-lg">Processando dados da instituição...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6  w-full overflow-x-hidden">
      
      <h1 className="text-2xl font-bold">Visão Institucional</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Cursos Cadastrados"
          value={metricas.totalCursos.toString()}
          icon={GraduationCap}
          bgClass="bg-[#21598E]"
          description="Ativos no sistema"
        />
        <KpiCard
          title="Atividades Submetidas"
          value={metricas.totalAtividades.toString()}
          icon={FileText}
          bgClass="bg-[#DA761F]"
          description="Volume total histórico"
        />
        <KpiCard
          title="Horas Validadas"
          value={metricas.horasValidadas.toString()}
          icon={Clock}
          bgClass="bg-[#210367]"
          description="Aprovadas aos alunos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 min-w-0">
        
        {/* RANKING DE COORDENADORES */}
        <div className="lg:col-span-1 flex flex-col min-w-0">
          {/* Título sem subtítulo */}
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Top Validadores
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex-1">
            <div className="flex flex-col gap-3">
              {rankingCoordenadores.length > 0 ? (
                rankingCoordenadores.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className={`flex items-center justify-center size-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-[#004A8D]'}`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-700 truncate">
                        {item.nome}
                      </span>
                    </div>
                    <span className="bg-[#004A8D] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm shrink-0">
                      {item.quantidade} val.
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <Trophy className="size-10 mb-3 opacity-20" />
                  <p className="text-center text-sm">Ainda não há validações.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NOVO RAIO-X: Direto e Intuitivo */}
        <div className="lg:col-span-2 flex flex-col min-w-0">
          
          {/* Título sem subtítulo */}
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Raio-X de Atividades
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            
            {/* Bloco 1: Status */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 w-full">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <Activity className="size-5 text-[#DA761F]" /> 
                Por Status
              </h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Aprovadas</span>
                    <span className="font-bold text-slate-800">{distribuicaoStatus.aprovadas}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${calcPercent(distribuicaoStatus.aprovadas, metricas.totalAtividades)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Pendentes</span>
                    <span className="font-bold text-slate-800">{distribuicaoStatus.pendentes}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${calcPercent(distribuicaoStatus.pendentes, metricas.totalAtividades)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Rejeitadas</span>
                    <span className="font-bold text-slate-800">{distribuicaoStatus.rejeitadas}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${calcPercent(distribuicaoStatus.rejeitadas, metricas.totalAtividades)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Categoria */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 w-full">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                <BookOpen className="size-5 text-[#004A8D]" /> 
                Por Categoria
              </h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Ensino</span>
                    <span className="font-bold text-slate-800">{distribuicaoCategoria.ensino}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#004A8D] h-full rounded-full" style={{ width: `${calcPercent(distribuicaoCategoria.ensino, metricas.totalAtividades)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Pesquisa</span>
                    <span className="font-bold text-slate-800">{distribuicaoCategoria.pesquisa}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#DA761F] h-full rounded-full" style={{ width: `${calcPercent(distribuicaoCategoria.pesquisa, metricas.totalAtividades)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">Extensão</span>
                    <span className="font-bold text-slate-800">{distribuicaoCategoria.extensao}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#210367] h-full rounded-full" style={{ width: `${calcPercent(distribuicaoCategoria.extensao, metricas.totalAtividades)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}