import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface DirectionBadgeProps {
  direction: string | null;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export function DirectionBadge({ direction, showIcon = true, size = 'sm' }: DirectionBadgeProps) {
  const isLong = direction?.toUpperCase() === 'LONG';
  const isShort = direction?.toUpperCase() === 'SHORT';

  if (!direction || (!isLong && !isShort)) {
    return (
      <span className={cn('badge-neutral', size === 'md' && 'px-3 py-1 text-sm')}>
        {showIcon && <Minus className="w-3 h-3 mr-1" />}
        <span>—</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        isLong ? 'badge-long' : 'badge-short',
        size === 'md' && 'px-3 py-1 text-sm'
      )}
    >
      {showIcon &&
        (isLong ? (
          <ArrowUpRight className="w-3 h-3 mr-1" />
        ) : (
          <ArrowDownRight className="w-3 h-3 mr-1" />
        ))}
      <span>{direction}</span>
    </span>
  );
}