export default function GestorDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Visão Geral (Painel da Secretaria)
          </h1>
          <p className="text-slate-500">
            Bem-vindo ao centro de gestão institucional.
          </p>
        </div>
      </div>

      <div className="h-[600px] w-full border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-400 font-medium italic">
            Módulo de Visão Macro em desenvolvimento...
          </p>
          <p className="text-xs text-slate-300">
            As métricas de engajamento por curso aparecerão aqui.
          </p>
        </div>
      </div>
    </div>
  );
}