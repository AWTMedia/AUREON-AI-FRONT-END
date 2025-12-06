import { KpiCard } from '@/components/ui/KpiCard';
import { useActiveFVGs } from '@/hooks/useFeatures';
import { Layers } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ActiveFVGsCard() {
  const { data, isLoading } = useActiveFVGs();

  if (isLoading) {
    return (
      <KpiCard title="Active FVGs" icon={Layers}>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-28" />
      </KpiCard>
    );
  }

  return (
    <KpiCard title="Active FVGs" icon={Layers}>
      <p className="text-3xl font-bold text-foreground mb-1">{data?.total || 0}</p>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-bullish">↑ {data?.up || 0} Up</span>
        <span className="text-bearish">↓ {data?.down || 0} Down</span>
      </div>
    </KpiCard>
  );
}