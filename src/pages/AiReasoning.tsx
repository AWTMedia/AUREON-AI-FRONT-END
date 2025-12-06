import { Header } from '@/components/layout/Header';
import { useAiLogs } from '@/hooks/useAiLogs';
import { EmptyState } from '@/components/ui/EmptyState';
import { DirectionBadge } from '@/components/ui/DirectionBadge';
import { SignalTypeBadge } from '@/components/ui/SignalTypeBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isSameDay, parseISO } from 'date-fns';
import { Brain, CandlestickChart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AiLog } from '@/types/trading';

interface GroupedLogs {
  date: string;
  logs: AiLog[];
}

function groupLogsByDate(logs: AiLog[]): GroupedLogs[] {
  const groups: Map<string, AiLog[]> = new Map();

  logs.forEach((log) => {
    const dateKey = format(parseISO(log.candle_time), 'yyyy-MM-dd');
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(log);
  });

  return Array.from(groups.entries())
    .map(([date, logs]) => ({ date, logs }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const AiReasoning = () => {
  const { data: logs, isLoading } = useAiLogs(100);
  const navigate = useNavigate();

  const groupedLogs = logs ? groupLogsByDate(logs) : [];

  return (
    <div className="min-h-screen">
      <Header
        title="AI Reasoning Feed"
        subtitle="Natural language analysis from the AI reasoner"
      />

      <div className="p-6 animate-fade-in">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-32 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : groupedLogs.length === 0 ? (
          <div className="trading-card">
            <EmptyState
              icon={Brain}
              title="No AI logs"
              description="AI reasoning entries will appear here as the engine runs."
            />
          </div>
        ) : (
          <div className="space-y-8">
            {groupedLogs.map((group) => (
              <div key={group.date}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {format(parseISO(group.date), 'MMMM d, yyyy')}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    ({group.logs.length} entries)
                  </span>
                </div>

                <div className="space-y-4 ml-4 border-l border-border pl-4">
                  {group.logs.map((log) => (
                    <div
                      key={log.id}
                      className="trading-card animate-slide-in-right"
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {log.timeframe}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(log.candle_time), 'HH:mm')} UTC
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {log.signal_type && (
                            <SignalTypeBadge signalType={log.signal_type} />
                          )}
                          {log.direction && (
                            <DirectionBadge direction={log.direction} />
                          )}
                        </div>
                      </div>

                      {/* Reasoning */}
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {log.reasoning}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
                        <button
                          onClick={() => navigate('/candles')}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <CandlestickChart className="w-3 h-3" />
                          View candle
                        </button>
                        {log.signal_type && log.signal_type !== 'NONE' && (
                          <button
                            onClick={() => navigate('/signals')}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Zap className="w-3 h-3" />
                            View signal
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiReasoning;