import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CandlestickChart,
  Zap,
  Brain,
  AlertCircle,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useLatestEvent } from '@/hooks/useSystemEvents';
import { format } from 'date-fns';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/candles', label: 'Candles', icon: CandlestickChart },
  { path: '/signals', label: 'Signals', icon: Zap },
  { path: '/ai', label: 'AI Reasoning', icon: Brain },
  { path: '/events', label: 'System Events', icon: AlertCircle },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { data: latestEvent } = useLatestEvent();

  // Determine engine status based on latest event
  const isOnline = latestEvent && 
    new Date(latestEvent.created_at).getTime() > Date.now() - 5 * 60 * 1000; // Within 5 minutes

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground tracking-wide">
                  Aureon AI
                </span>
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                  Engine Console
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-primary glow-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Engine Status */}
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                isOnline ? 'bg-bullish animate-pulse' : 'bg-muted-foreground'
              )}
            />
            {!collapsed && (
              <span className="text-xs text-muted-foreground">
                Engine: {isOnline ? 'Online' : 'Offline'}
              </span>
            )}
          </div>
          {!collapsed && latestEvent && (
            <p className="text-[10px] text-muted-foreground mt-1 truncate">
              Last: {format(new Date(latestEvent.created_at), 'HH:mm:ss')}
            </p>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}