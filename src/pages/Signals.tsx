import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useSignals } from '@/hooks/useSignals';
import { EmptyState } from '@/components/ui/EmptyState';
import { DirectionBadge } from '@/components/ui/DirectionBadge';
import { SignalTypeBadge } from '@/components/ui/SignalTypeBadge';
import { FeaturePills } from '@/components/ui/FeaturePills';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Zap, ChevronRight } from 'lucide-react';
import { TradeSignal, MarketFeature, AiLog } from '@/types/trading';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

function SignalDetailPanel({
  signal,
  onClose,
}: {
  signal: TradeSignal;
  onClose: () => void;
}) {
  // Fetch related features
  const { data: features } = useQuery({
    queryKey: ['features-for-signal', signal.candle_time, signal.timeframe],
    queryFn: async () => {
      const { data } = await supabase
        .from('market_features')
        .select('*')
        .eq('candle_time', signal.candle_time)
        .eq('timeframe', signal.timeframe)
        .maybeSingle();
      return data as MarketFeature | null;
    },
  });

  // Fetch related AI log
  const { data: aiLog } = useQuery({
    queryKey: ['ai-log-for-signal', signal.candle_time, signal.timeframe],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_logs')
        .select('*')
        .eq('candle_time', signal.candle_time)
        .eq('timeframe', signal.timeframe)
        .maybeSingle();
      return data as AiLog | null;
    },
  });

  return (
    <Sheet open={true} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Signal Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Signal Info */}
          <div className="trading-card">
            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
              Signal
            </h4>
            <div className="flex items-center gap-2 mb-4">
              <SignalTypeBadge signalType={signal.signal_type} />
              <DirectionBadge direction={signal.direction} size="md" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground">Time</span>
                <p className="font-mono text-sm">
                  {format(new Date(signal.candle_time), 'MMM dd, HH:mm')} UTC
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Timeframe</span>
                <p className="font-mono text-sm">{signal.timeframe}</p>
              </div>
              {signal.meta_json?.price && (
                <div>
                  <span className="text-xs text-muted-foreground">Price</span>
                  <p className="font-mono text-sm font-semibold">
                    {Number(signal.meta_json.price).toFixed(5)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Meta JSON */}
          <div className="trading-card">
            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
              Meta Data
            </h4>
            <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto font-mono">
              {JSON.stringify(signal.meta_json, null, 2)}
            </pre>
          </div>

          {/* Features */}
          {features && (
            <div className="trading-card">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                Market Features
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground">Structure</span>
                  <FeaturePills features={features} show="structure" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Imbalances</span>
                  <FeaturePills features={features} show="imbalance" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Sweeps</span>
                  <FeaturePills features={features} show="sweeps" />
                </div>
              </div>
            </div>
          )}

          {/* AI Reasoning */}
          {aiLog && (
            <div className="trading-card">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                AI Reasoning
              </h4>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {aiLog.reasoning}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const Signals = () => {
  const { data: signals, isLoading } = useSignals(50);
  const [selectedSignal, setSelectedSignal] = useState<TradeSignal | null>(null);

  return (
    <div className="min-h-screen">
      <Header
        title="Signal Feed"
        subtitle="Trade signals generated by the engine"
      />

      <div className="p-6 animate-fade-in">
        {isLoading ? (
          <div className="trading-card">
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </div>
        ) : !signals || signals.length === 0 ? (
          <div className="trading-card">
            <EmptyState
              icon={Zap}
              title="No signals"
              description="No trade signals available for this timeframe and date range."
            />
          </div>
        ) : (
          <div className="trading-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>TF</th>
                    <th>Type</th>
                    <th>Direction</th>
                    <th>Price</th>
                    <th>Reason</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal) => {
                    const isActionable =
                      signal.signal_type && signal.signal_type !== 'NONE';
                    return (
                      <tr
                        key={signal.id}
                        onClick={() => setSelectedSignal(signal)}
                        className={!isActionable ? 'opacity-50' : ''}
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
                        <td className="text-muted-foreground text-xs max-w-xs truncate">
                          {signal.meta_json?.reason || '—'}
                        </td>
                        <td>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedSignal && (
        <SignalDetailPanel
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
        />
      )}
    </div>
  );
};

export default Signals;