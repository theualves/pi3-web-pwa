import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { buscarDadosUsuarios } from "@/services/usuariosService";
import { TabelaUsuarios } from "@/components/TabelaUsuarios";


export default async function UsuariosPage() {
  // Mantemos as estatísticas (KPIs) vindo do servidor
  const stats = await buscarDadosUsuarios();

  const colunas = [
    { header: "Nome", accessor: "nome" },
    { header: "E-mail", accessor: "email" },
    // No seu JSON do banco, o campo é "tipo", mas na tabela você quer exibir "Perfil"
    { header: "Perfil", accessor: "tipo" }, 
    { header: "Status", accessor: "status" },
    // "cursoNome" é a chave que criamos dentro da TabelaUsuarios para facilitar a leitura
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
          value={stats.totalCoordenadores}
          icon={Users}
          bgClass=""
          description="+12 novos este mês"
        />

        <KpiCard
          title="Novos esse mês"
          value={`${stats.novosUsuariosMes}%`}
          icon={CheckCircle2}
          bgClass=""
          description="+8% em relação ao mês anterior"
        />

        <KpiCard
          title="Inativos"
          value={`${stats.usuariosInativos}%`}
          icon={AlertTriangle}
          bgClass=""
          description="-5% em relação ao mês anterior"
        />
      </div>

      {/* A TabelaUsuarios agora não precisa mais de dadosMockados.
         Ela vai fazer o fetch automaticamente ao carregar.
      */}
      <TabelaUsuarios colunas={colunas} />
    </div>
  );
}