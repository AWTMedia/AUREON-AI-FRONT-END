import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useCandlesWithFeatures } from '@/hooks/useCandles';
import { EmptyState } from '@/components/ui/EmptyState';
import { FeaturePills } from '@/components/ui/FeaturePills';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CandlestickChart, ChevronRight } from 'lucide-react';
import { CandleWithFeatures } from '@/types/trading';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DirectionBadge } from '@/components/ui/DirectionBadge';
import { SignalTypeBadge } from '@/components/ui/SignalTypeBadge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TradeSignal, AiLog } from '@/types/trading';

function CandleDetailPanel({
  candle,
  onClose,
}: {
  candle: CandleWithFeatures;
  onClose: () => void;
}) {
  // Fetch related signal
  const { data: signal } = useQuery({
    queryKey: ['signal-for-candle', candle.candle_time, candle.timeframe],
    queryFn: async () => {
      const { data } = await supabase
        .from('trade_signals')
        .select('*')
        .eq('candle_time', candle.candle_time)
        .eq('timeframe', candle.timeframe)
        .maybeSingle();
      return data as TradeSignal | null;
    },
  });

  // Fetch related AI log
  const { data: aiLog } = useQuery({
    queryKey: ['ai-log-for-candle', candle.candle_time, candle.timeframe],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_logs')
        .select('*')
        .eq('candle_time', candle.candle_time)
        .eq('timeframe', candle.timeframe)
        .maybeSingle();
      return data as AiLog | null;
    },
  });

  const isBullish = Number(candle.close) > Number(candle.open);

  return (
    <Sheet open={true} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CandlestickChart className="w-5 h-5 text-primary" />
            Candle Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="trading-card">
            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
              OHLCV Data
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground">Time</span>
                <p className="font-mono text-sm">
                  {format(new Date(candle.candle_time), 'MMM dd, HH:mm')}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Timeframe</span>
                <p className="font-mono text-sm">{candle.timeframe}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Open</span>
                <p className="font-mono text-sm">{Number(candle.open).toFixed(5)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">High</span>
                <p className="font-mono text-sm">{Number(candle.high).toFixed(5)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Low</span>
                <p className="font-mono text-sm">{Number(candle.low).toFixed(5)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Close</span>
                <p className={`font-mono text-sm ${isBullish ? 'text-bullish' : 'text-bearish'}`}>
                  {Number(candle.close).toFixed(5)}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          {candle.features && (
            <>
              <div className="trading-card">
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                  Structure
                </h4>
                <FeaturePills features={candle.features} show="structure" />
              </div>

              <div className="trading-card">
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                  Imbalances
                </h4>
                <FeaturePills features={candle.features} show="imbalance" />
                {(candle.features.fvg_up || candle.features.fvg_down) && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Gap Size: {Number(candle.features.fvg_gap_size).toFixed(5)}
                  </p>
                )}
              </div>

              <div className="trading-card">
                <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                  Sweeps
                </h4>
                <FeaturePills features={candle.features} show="sweeps" />
              </div>
            </>
          )}

          {/* Signal */}
          {signal && (
            <div className="trading-card">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                Trade Signal
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <SignalTypeBadge signalType={signal.signal_type} />
                <DirectionBadge direction={signal.direction} />
              </div>
              {signal.meta_json?.price && (
                <p className="text-sm font-mono">
                  Price: {Number(signal.meta_json.price).toFixed(5)}
                </p>
              )}
              {signal.meta_json?.reason && (
                <p className="text-sm text-muted-foreground mt-2">
                  {signal.meta_json.reason}
                </p>
              )}
            </div>
          )}

          {/* AI Log */}
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

const Candles = () => {
  const { data: candles, isLoading } = useCandlesWithFeatures(100);
  const [selectedCandle, setSelectedCandle] = useState<CandleWithFeatures | null>(null);

  return (
    <div className="min-h-screen">
      <Header
        title="Candles & Features"
        subtitle="Explore candle data with market structure features"
      />

      <div className="p-6 animate-fade-in">
        {isLoading ? (
          <div className="trading-card">
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ) : !candles || candles.length === 0 ? (
          <div className="trading-card">
            <EmptyState
              icon={CandlestickChart}
              title="No candle data"
              description="No candles available for this timeframe and date range."
            />
          </div>
        ) : (
          <div className="trading-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                    <th>Structure</th>
                    <th>Imbalances</th>
                    <th>Sweeps</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {candles.map((candle) => {
                    const isBullish = Number(candle.close) > Number(candle.open);
                    return (
                      <tr
                        key={candle.id}
                        onClick={() => setSelectedCandle(candle)}
                      >
                        <td className="font-mono-data">
                          {format(new Date(candle.candle_time), 'MMM dd HH:mm')}
                        </td>
                        <td className="font-mono-data">{Number(candle.open).toFixed(5)}</td>
                        <td className="font-mono-data">{Number(candle.high).toFixed(5)}</td>
                        <td className="font-mono-data">{Number(candle.low).toFixed(5)}</td>
                        <td
                          className={`font-mono-data font-semibold ${
                            isBullish ? 'text-bullish' : 'text-bearish'
                          }`}
                        >
                          {Number(candle.close).toFixed(5)}
                        </td>
                        <td>
                          <FeaturePills features={candle.features} show="structure" />
                        </td>
                        <td>
                          <FeaturePills features={candle.features} show="imbalance" />
                        </td>
                        <td>
                          <FeaturePills features={candle.features} show="sweeps" />
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

      {selectedCandle && (
        <CandleDetailPanel
          candle={selectedCandle}
          onClose={() => setSelectedCandle(null)}
        />
      )}
    </div>
  );
};

export default Candles;