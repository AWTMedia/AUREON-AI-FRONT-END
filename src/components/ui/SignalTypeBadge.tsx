import { cn } from '@/lib/utils';
import { Zap, LogOut, Ban } from 'lucide-react';

interface SignalTypeBadgeProps {
  signalType: string | null;
}

export function SignalTypeBadge({ signalType }: SignalTypeBadgeProps) {
  const type = signalType?.toUpperCase();

  if (!type || type === 'NONE') {
    return (
      <span className="badge-neutral">
        <Ban className="w-3 h-3 mr-1" />
        <span>NONE</span>
      </span>
    );
  }

  const isEntry = type === 'ENTRY';
  const isExit = type === 'EXIT';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold',
        isEntry && 'bg-primary/20 text-primary border border-primary/30',
        isExit && 'bg-warning/20 text-warning border border-warning/30',
        !isEntry && !isExit && 'badge-neutral'
      )}
    >
      {isEntry && <Zap className="w-3 h-3 mr-1" />}
      {isExit && <LogOut className="w-3 h-3 mr-1" />}
      <span>{signalType}</span>
    </span>
  );
}