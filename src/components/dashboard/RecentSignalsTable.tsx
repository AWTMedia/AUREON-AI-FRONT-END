import { useSignals } from '@/hooks/useSignals';
import { DirectionBadge } from '@/components/ui/DirectionBadge';
import { SignalTypeBadge } from '@/components/ui/SignalTypeBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function RecentSignalsTable() {
  const { data: signals, isLoading } = useSignals(10);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="trading-card">
        <h3 className="text-sm font-medium text-foreground mb-4">Recent Signals</h3>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!signals || signals.length === 0) {
    return (
      <div className="trading-card">
        <h3 className="text-sm font-medium text-foreground mb-4">Recent Signals</h3>
        <EmptyState
          icon={Zap}
          title="No signals yet"
          description="Signals will appear here when the engine generates them."
        />
      </div>
    );
  }

  return (
    <div className="trading-card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Recent Signals</h3>
        <button
          onClick={() => navigate('/signals')}
          className="text-xs text-primary hover:underline"
        >
          View all →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>TF</th>
              <th>Type</th>
              <th>Direction</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr
                key={signal.id}
                onClick={() => navigate('/signals')}
                className="cursor-pointer"
              >
                <td className="font-mono-data">
                  {format(new Date(signal.candle_time), 'MMM dd HH:mm')}
                </td>
                <td className="text-muted-foreground">{signal.timeframe}</td>
                <td>
                  <SignalTypeBadge signalType={signal.signal_type} />
                </td>
                <td>
                  <DirectionBadge direction={signal.direction} />
                </td>
                <td className="font-mono-data">
                  {signal.meta_json?.price
                    ? Number(signal.meta_json.price).toFixed(5)
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}