import { KpiCard } from "@/components/KpiCard";
import { Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { buscarDadosUsuarios } from "@/services/usuariosService";
import { TabelaUsuarios } from "@/components/TabelaUsuarios";

export default async function UsuariosPage() {
  const stats = await buscarDadosUsuarios();

  const colunas = [
    { header: "Nome", accessor: "nome" },
    { header: "E-mail", accessor: "email" },
    { header: "Perfil", accessor: "perfil" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  const usuariosMock = [
    { id: "1", nome: "Matheus Silva", email: "matheus@senac.br", perfil: "Coordenador", status: "Ativo" },
    { id: "2", nome: "Ana Souza", email: "ana.souza@aluno.senac.br", perfil: "Aluno", status: "Ativo" },
    { id: "3", nome: "Carlos Eduardo", email: "carlos.ed@aluno.senac.br", perfil: "Aluno", status: "Inativo" },
    { id: "4", nome: "Prof. Marcos", email: "marcos@senac.br", perfil: "Coordenador", status: "Ativo" },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestão de Usuários
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

      <TabelaUsuarios colunas={colunas} dadosMockados={usuariosMock} />
    </div>
  );
}