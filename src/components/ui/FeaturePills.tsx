import { MarketFeature } from '@/types/trading';
import { cn } from '@/lib/utils';

interface FeaturePillsProps {
  features: MarketFeature | undefined;
  show?: 'structure' | 'imbalance' | 'sweeps' | 'all';
}

export function FeaturePills({ features, show = 'all' }: FeaturePillsProps) {
  if (!features) {
    return <span className="text-muted-foreground text-xs">N/A</span>;
  }

  const pills: { label: string; active: boolean; variant: 'up' | 'down' | 'neutral' }[] = [];

  // Structure
  if (show === 'all' || show === 'structure') {
    if (features.swing_high) pills.push({ label: 'SH', active: true, variant: 'up' });
    if (features.swing_low) pills.push({ label: 'SL', active: true, variant: 'down' });
    if (features.bos_up) pills.push({ label: 'BOS↑', active: true, variant: 'up' });
    if (features.bos_down) pills.push({ label: 'BOS↓', active: true, variant: 'down' });
    if (features.mss_up) pills.push({ label: 'MSS↑', active: true, variant: 'up' });
    if (features.mss_down) pills.push({ label: 'MSS↓', active: true, variant: 'down' });
  }

  // Imbalance
  if (show === 'all' || show === 'imbalance') {
    if (features.fvg_up) pills.push({ label: 'FVG↑', active: !features.fvg_resolved, variant: 'up' });
    if (features.fvg_down) pills.push({ label: 'FVG↓', active: !features.fvg_resolved, variant: 'down' });
    if (features.og_up) pills.push({ label: 'OG↑', active: !features.og_resolved, variant: 'up' });
    if (features.og_down) pills.push({ label: 'OG↓', active: !features.og_resolved, variant: 'down' });
    if (features.vi_up) pills.push({ label: 'VI↑', active: !features.vi_resolved, variant: 'up' });
    if (features.vi_down) pills.push({ label: 'VI↓', active: !features.vi_resolved, variant: 'down' });
  }

  // Sweeps
  if (show === 'all' || show === 'sweeps') {
    if (features.swept_high) pills.push({ label: 'Swept H', active: true, variant: 'up' });
    if (features.swept_low) pills.push({ label: 'Swept L', active: true, variant: 'down' });
    if (features.equal_highs) pills.push({ label: 'EQH', active: true, variant: 'neutral' });
    if (features.equal_lows) pills.push({ label: 'EQL', active: true, variant: 'neutral' });
  }

  if (pills.length === 0) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {pills.map((pill, i) => (
        <span
          key={i}
          className={cn(
            'feature-pill',
            pill.active
              ? pill.variant === 'up'
                ? 'bg-bullish/20 text-bullish border border-bullish/30'
                : pill.variant === 'down'
                ? 'bg-bearish/20 text-bearish border border-bearish/30'
                : 'feature-pill-active'
              : 'feature-pill-inactive line-through'
          )}
        >
          {pill.label}
        </span>
      ))}
    </div>
  );
}