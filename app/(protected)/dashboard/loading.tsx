import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="w-full bg-background border-0 sm:border border-border sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
