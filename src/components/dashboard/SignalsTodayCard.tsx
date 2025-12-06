import { KpiCard } from '@/components/ui/KpiCard';
import { useSignalsToday } from '@/hooks/useSignals';
import { Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function SignalsTodayCard() {
  const { data, isLoading } = useSignalsToday();

  if (isLoading) {
    return (
      <KpiCard title="Signals Today" icon={Activity}>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-24" />
      </KpiCard>
    );
  }

  return (
    <KpiCard title="Signals Today" icon={Activity}>
      <p className="text-3xl font-bold text-foreground mb-1">{data?.total || 0}</p>
      <p className="text-xs text-muted-foreground">
        {data?.actionable || 0} actionable
      </p>
    </KpiCard>
  );
}