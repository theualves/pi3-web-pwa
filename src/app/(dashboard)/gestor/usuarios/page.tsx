"use client";

import { useState, useEffect } from "react";
import { KpiCard } from "@/components/KpiCard";
import { Users, UserCheck, UserX, Loader2 } from "lucide-react";
import { TabelaUsuarios } from "@/components/TabelaUsuarios";
import { api } from "@/lib/api";

export default function UsuariosPage() {
  const [coordenadores, setCoordenadores] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const colunas = [
    { header: "Nome", accessor: "nome" },
    { header: "E-mail", accessor: "email" },
    { header: "Perfil", accessor: "tipo" }, 
    { header: "Status", accessor: "status" },
    { header: "Curso", accessor: "cursoNome" }, 
    { header: "Ações", accessor: "acoes" },
  ];

  useEffect(() => {
    const carregarCoordenadores = async () => {
      setCarregando(true);
      try {
        // ⚠️ Ajuste essa rota para o endpoint real do seu backend que lista os usuários/coordenadores
        const res = await api("/api/usuarios?tipo=COORDENADOR");
        
        if (res.ok) {
          const dados = await res.json();
          // Ajuste caso o seu backend retorne dentro de um objeto (ex: dados.usuarios)
          setCoordenadores(Array.isArray(dados) ? dados : dados.usuarios || []);
        } else {
          console.error("Erro ao buscar coordenadores.");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarCoordenadores();
  }, []);

  // 👉 CÁLCULO DOS KPIs REAIS EM TEMPO DE EXECUÇÃO
  const totalCoordenadores = coordenadores.length;
  // Ajuste "ATIVO" ou "INATIVO" para bater com o nome exato do status no seu banco de dados
  const ativos = coordenadores.filter((c) => c.status?.toUpperCase() === "ATIVO").length;
  const inativos = coordenadores.filter((c) => c.status?.toUpperCase() !== "ATIVO").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão de Coordenadores
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie os acessos e vínculos dos coordenadores de curso.
          </p>
        </div>
      </div>

      {/* 👉 KPIs DINÂMICOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Total Cadastrados"
          value={totalCoordenadores.toString()}
          icon={Users}
          bgClass=""
          description="Coordenadores no sistema"
        />

        <KpiCard
          title="Acessos Ativos"
          value={ativos.toString()}
          icon={UserCheck}
          bgClass=""
          description="Com permissão de login"
        />

        <KpiCard
          title="Inativos / Bloqueados"
          value={inativos.toString()}
          icon={UserX}
          bgClass=""
          description="Sem permissão de acesso"
        />
      </div>

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="size-8 animate-spin text-[#004A8D] mb-4" />
            <p className="font-medium">Carregando lista de coordenadores...</p>
          </div>
        ) : (
          // Passamos os dados que buscamos na página direto para a tabela renderizar
          <TabelaUsuarios colunas={colunas} data={coordenadores} />
        )}

    </div>
  );
}