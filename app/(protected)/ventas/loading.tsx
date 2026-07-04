import { Skeleton } from "@/components/ui/skeleton";

export default function VentasLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="w-full bg-background border-0 sm:border border-border sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl mb-8" />
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Skeleton className="h-48 w-full max-w-md" />
        </div>
      </div>
    </div>
  );
}
