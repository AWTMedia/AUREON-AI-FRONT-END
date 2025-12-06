import { KpiCard } from '@/components/ui/KpiCard';
import { useLatestValidSignal } from '@/hooks/useSignals';
import { Zap } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { DirectionBadge } from '@/components/ui/DirectionBadge';
import { SignalTypeBadge } from '@/components/ui/SignalTypeBadge';

export function LatestSignalCard() {
  const { data: signal, isLoading } = useLatestValidSignal();

  if (isLoading) {
    return (
      <KpiCard title="Latest Signal" icon={Zap}>
        <Skeleton className="h-6 w-20 mb-2" />
        <Skeleton className="h-4 w-28" />
      </KpiCard>
    );
  }

  if (!signal) {
    return (
      <KpiCard title="Latest Signal" icon={Zap}>
        <p className="text-muted-foreground text-sm mb-1">No actionable signal yet</p>
        <p className="text-xs text-muted-foreground">Waiting for engine...</p>
      </KpiCard>
    );
  }

  const price = signal.meta_json?.price;

  return (
    <KpiCard
      title="Latest Signal"
      icon={Zap}
      variant={signal.direction?.toUpperCase() === 'LONG' ? 'bullish' : 'bearish'}
    >
      <div className="flex items-center gap-2 mb-2">
        <SignalTypeBadge signalType={signal.signal_type} />
        <DirectionBadge direction={signal.direction} />
      </div>
      <div className="space-y-1">
        {price && (
          <p className="text-lg font-bold font-mono text-foreground">
            @ {Number(price).toFixed(5)}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {signal.timeframe} — {format(new Date(signal.candle_time), 'MMM dd, HH:mm')}
        </p>
      </div>
    </KpiCard>
  );
}