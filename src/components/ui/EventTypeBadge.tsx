import { cn } from '@/lib/utils';
import { Info, AlertTriangle, XCircle } from 'lucide-react';

interface EventTypeBadgeProps {
  eventType: 'info' | 'error' | 'warning' | string;
}

export function EventTypeBadge({ eventType }: EventTypeBadgeProps) {
  const type = eventType.toLowerCase();

  const config = {
    info: {
      icon: Info,
      className: 'bg-info/20 text-info border-info/30',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-warning/20 text-warning border-warning/30',
    },
    error: {
      icon: XCircle,
      className: 'bg-destructive/20 text-destructive border-destructive/30',
    },
  };

  const { icon: Icon, className } = config[type as keyof typeof config] || config.info;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border',
        className
      )}
    >
      <Icon className="w-3 h-3 mr-1" />
      <span className="uppercase">{eventType}</span>
    </span>
  );
}