import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  bgClass?: string; // Nova prop para o fundo
}

export function KpiCard({ title, value, description, icon: Icon, bgClass }: KpiCardProps) {
  // Se houver bgClass, usamos texto branco. Se não, usamos o padrão slate.
  const isCustomBg = !!bgClass;

  return (
    <Card className={`shadow-sm border-none ${bgClass || "bg-white border-slate-200"}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-semibold ${isCustomBg ? "text-white/90" : "text-slate-600"}`}>
          {title}
        </CardTitle>
        <Icon className={`size-5 ${isCustomBg ? "text-white" : "text-[#F28322]"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${isCustomBg ? "text-white" : "text-slate-900"}`}>
          {value}
        </div>
        {description && (
          <p className={`text-xs mt-1 ${isCustomBg ? "text-white/80" : "text-slate-500"}`}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}