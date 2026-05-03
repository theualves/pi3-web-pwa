import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[130px] w-full rounded-xl bg-slate-200" />
        <Skeleton className="h-[130px] w-full rounded-xl bg-slate-200" />
        <Skeleton className="h-[130px] w-full rounded-xl bg-slate-200" />
      </div>

      <Skeleton className="h-[220px] w-full rounded-xl bg-slate-200" />
    </div>
  );
}