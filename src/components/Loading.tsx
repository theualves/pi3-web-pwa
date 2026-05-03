import { IconeSenac } from "./IconeSenac";

export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <IconeSenac animated={true} className="h-24 w-auto mb-4" />
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
        Carregando...
      </p>
    </div>
  );
}