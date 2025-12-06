import { useFilters } from '@/contexts/FilterContext';
import { Button } from '@/components/ui/button';
import { Timeframe } from '@/types/trading';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const timeframes: Timeframe[] = ['15m', '1H', '4H'];
const quickRanges = [
  { label: 'Today', value: 'today' as const },
  { label: '24h', value: '24h' as const },
  { label: '7d', value: '7d' as const },
  { label: '30d', value: '30d' as const },
];

export function Header({ title, subtitle }: HeaderProps) {
  const { timeframe, setTimeframe, setQuickRange } = useFilters();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Clock className="w-4 h-4 text-muted-foreground ml-2" />
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={cn(
                  'h-7 px-3 text-xs font-medium',
                  timeframe === tf
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {tf}
              </Button>
            ))}
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Calendar className="w-4 h-4 text-muted-foreground ml-2" />
            {quickRanges.map((range) => (
              <Button
                key={range.value}
                variant="ghost"
                size="sm"
                onClick={() => setQuickRange(range.value)}
                className="h-7 px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}