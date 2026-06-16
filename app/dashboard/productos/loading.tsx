import { Skeleton } from "@/components/ui/skeleton";

export default function ProductosLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="w-full bg-background border-0 sm:border border-border sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center justify-end w-full gap-2 mb-6">
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-3">
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-36" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}
