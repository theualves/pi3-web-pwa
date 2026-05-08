import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TableSkeleton() {
  return (
    <Card className="w-full shadow-sm border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px]" /> 
          <Skeleton className="h-10 w-[300px]" /> 
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">

          <div className="flex items-center space-x-4 border-b pb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          

          {[1, 2, 3, 4, 5].map((linha) => (
            <div key={linha} className="flex items-center space-x-4 py-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-3 w-[50%]" />
              </div>
              <Skeleton className="h-8 w-[100px]" /> 
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}