import { useRecentAiLogs } from '@/hooks/useAiLogs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { DirectionBadge } from '@/components/ui/DirectionBadge';
import { SignalTypeBadge } from '@/components/ui/SignalTypeBadge';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function RecentAiLogs() {
  const { data: logs, isLoading } = useRecentAiLogs(5);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="trading-card">
        <h3 className="text-sm font-medium text-foreground mb-4">AI Reasoning</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="trading-card">
        <h3 className="text-sm font-medium text-foreground mb-4">AI Reasoning</h3>
        <EmptyState
          icon={Brain}
          title="No AI logs yet"
          description="AI reasoning will appear here as the engine runs."
        />
      </div>
    );
  }

  return (
    <div className="trading-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">AI Reasoning</h3>
        <button
          onClick={() => navigate('/ai')}
          className="text-xs text-primary hover:underline"
        >
          View all →
        </button>
      </div>
      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-colors cursor-pointer"
            onClick={() => navigate('/ai')}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                {log.timeframe} • {format(new Date(log.candle_time), 'MMM dd HH:mm')}
              </span>
              <div className="flex items-center gap-2">
                {log.signal_type && <SignalTypeBadge signalType={log.signal_type} />}
                {log.direction && <DirectionBadge direction={log.direction} />}
              </div>
            </div>
            <p className="text-sm text-foreground line-clamp-3">{log.reasoning}</p>
            <button className="text-xs text-primary mt-2 hover:underline">
              Read more →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}