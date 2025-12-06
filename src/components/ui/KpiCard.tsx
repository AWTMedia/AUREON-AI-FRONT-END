import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bullish' | 'bearish';
}

export function KpiCard({ title, icon: Icon, children, className, variant = 'default' }: KpiCardProps) {
  return (
    <div className={cn('kpi-card', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <Icon
          className={cn(
            'w-4 h-4',
            variant === 'bullish' && 'text-bullish',
            variant === 'bearish' && 'text-bearish',
            variant === 'default' && 'text-primary'
          )}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}