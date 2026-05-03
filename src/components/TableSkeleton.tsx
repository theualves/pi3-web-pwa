import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TableSkeleton() {
  return (
    <Card className="w-full shadow-sm border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" /> {/* Título "Lista de Estudantes" */}
          <Skeleton className="h-10 w-[300px]" /> {/* Input de Busca */}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Imitando o Cabeçalho da Tabela (mais escuro/fino) */}
          <div className="flex items-center space-x-4 border-b pb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          
          {/* Imitando as Linhas da Tabela (repetimos umas 5 vezes) */}
          {[1, 2, 3, 4, 5].map((linha) => (
            <div key={linha} className="flex items-center space-x-4 py-2">
              {/* Imitando um avatar ou ícone */}
              <Skeleton className="h-10 w-10 rounded-full" />
              {/* Imitando os textos das colunas */}
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-3 w-[50%]" />
              </div>
              <Skeleton className="h-8 w-[100px]" /> {/* Botão de Ação */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}