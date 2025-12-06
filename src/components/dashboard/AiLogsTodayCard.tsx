import { KpiCard } from '@/components/ui/KpiCard';
import { useAiLogsToday } from '@/hooks/useAiLogs';
import { Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AiLogsTodayCard() {
  const { data: count, isLoading } = useAiLogsToday();

  if (isLoading) {
    return (
      <KpiCard title="AI Logs (24h)" icon={Brain}>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-20" />
      </KpiCard>
    );
  }

  return (
    <KpiCard title="AI Logs (24h)" icon={Brain}>
      <p className="text-3xl font-bold text-foreground mb-1">{count || 0}</p>
      <p className="text-xs text-muted-foreground">Reasoning entries</p>
    </KpiCard>
  );
}