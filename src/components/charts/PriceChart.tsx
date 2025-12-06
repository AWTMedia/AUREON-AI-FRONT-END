import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useCandles } from '@/hooks/useCandles';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { TrendingUp } from 'lucide-react';

export function PriceChart() {
  const { data: candles, isLoading, error } = useCandles(100);

  if (isLoading) {
    return (
      <div className="trading-card h-64">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (error || !candles || candles.length === 0) {
    return (
      <div className="trading-card h-64">
        <EmptyState
          icon={TrendingUp}
          title="No price data"
          description="No candles available for this timeframe and range."
        />
      </div>
    );
  }

  // Reverse to show oldest first
  const chartData = [...candles].reverse().map((c) => ({
    time: format(new Date(c.candle_time), 'HH:mm'),
    fullTime: format(new Date(c.candle_time), 'MMM dd HH:mm'),
    close: Number(c.close),
    open: Number(c.open),
  }));

  const prices = chartData.map((d) => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="trading-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Price Chart</h3>
        <span className="text-xs text-muted-foreground">Last {candles.length} candles</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice - padding, maxPrice + padding]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(v) => v.toFixed(2)}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelFormatter={(_, payload) => payload[0]?.payload?.fullTime || ''}
              formatter={(value: number) => [value.toFixed(5), 'Close']}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}