import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { TabelaUsuarios } from "@/components/TabelaUsuarios";


export default async function UsuariosPage() {

  const stats = {
    coordenadoresAtivos: 5, 
    relatoriosRecebidos: 6,  
    horasAprovadas: 120     
  };

  const colunas = [
    { header: "Nome", accessor: "nome" },
    { header: "E-mail", accessor: "email" },
    { header: "Perfil", accessor: "tipo" }, 
    { header: "Status", accessor: "status" },
    { header: "Curso", accessor: "cursoNome" }, 
    { header: "Ações", accessor: "acoes" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão de Coordenadores
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Coordenadores"
          value={stats.coordenadoresAtivos}
          icon={Users}
          bgClass=""
          description=""
        />

        <KpiCard
          title="Relatórios Recebidos"
          value={`${stats.relatoriosRecebidos}`}
          icon={CheckCircle2}
          bgClass=""
          description=""
        />

        <KpiCard
          title="Horas Aprovadas"
          value={`${stats.horasAprovadas}`}
          icon={AlertTriangle}
          bgClass=""
          description=""
        />
      </div>


      <TabelaUsuarios colunas={colunas} />
    </div>
  );
}