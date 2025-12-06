import { KpiCard } from '@/components/ui/KpiCard';
import { useLatestCandle } from '@/hooks/useCandles';
import { useFilters } from '@/contexts/FilterContext';
import { CandlestickChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function LatestCandleCard() {
  const { timeframe } = useFilters();
  const { data: candle, isLoading } = useLatestCandle();

  if (isLoading) {
    return (
      <KpiCard title="Latest Candle" icon={CandlestickChart}>
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-4 w-32" />
      </KpiCard>
    );
  }

  if (!candle) {
    return (
      <KpiCard title="Latest Candle" icon={CandlestickChart}>
        <p className="text-muted-foreground text-sm">No candle data</p>
      </KpiCard>
    );
  }

  const isBullish = Number(candle.close) > Number(candle.open);

  return (
    <KpiCard
      title="Latest Candle"
      icon={CandlestickChart}
      variant={isBullish ? 'bullish' : 'bearish'}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl font-bold font-mono text-foreground">
          {Number(candle.close).toFixed(5)}
        </span>
        <span
          className={`flex items-center text-xs font-medium ${
            isBullish ? 'text-bullish' : 'text-bearish'
          }`}
        >
          {isBullish ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {isBullish ? 'UP' : 'DOWN'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {timeframe} — {format(new Date(candle.candle_time), 'MMM dd, HH:mm')} UTC
      </p>
    </KpiCard>
  );
}