import { GraduationCap, Clock, BookOpen } from "lucide-react";

export default function AlunoCursos() {
  const cursosMatriculados = [
    {
      id: "1",
      nome: "Análise e Desenvolvimento de Sistemas (ADS)",
      turno: "Noturno",
      status: "Ativo",
    },
    {
      id: "2",
      nome: "Administração",
      turno: "EAD",
      status: "Ativo",
    },
    {
      id: "3",
      nome: "Gestão de Projetos Ágeis",
      turno: "Vespertino",
      status: "Trancado",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-700 border-green-200";
      case "Trancado":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Concluído":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meus Cursos</h1>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {cursosMatriculados.map((curso) => (
          <div
            key={curso.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow duration-200 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-[#004A8D]"></div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-[#004A8D] shrink-0">
                <GraduationCap className="size-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">
                {curso.nome}
              </h2>
              <Clock className="size-4 text-slate-400" />
              <span className="text-sm font-medium">Turno:</span>
              <span className="text-sm text-slate-800 font-semibold">
                {curso.turno}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 md:min-w-fit">
              <div className="flex items-center gap-2 text-slate-600"></div>

              <div className="flex items-center gap-2 text-slate-600">
                <BookOpen className="size-4 text-slate-400 md:hidden" />
                <span className="text-sm font-medium md:hidden">Situação:</span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                    curso.status,
                  )}`}
                >
                  {curso.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cursosMatriculados.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <GraduationCap className="size-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">
            Nenhum curso encontrado
          </h3>
          <p className="text-slate-500 mt-2">
            Você ainda não está matriculado em nenhum curso.
          </p>
        </div>
      )}
    </div>
  );
}
