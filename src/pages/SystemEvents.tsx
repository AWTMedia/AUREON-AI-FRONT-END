import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { useSystemEvents } from '@/hooks/useSystemEvents';
import { EmptyState } from '@/components/ui/EmptyState';
import { EventTypeBadge } from '@/components/ui/EventTypeBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { SystemEvent } from '@/types/trading';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const eventTypeFilters = [
  { label: 'All', value: null },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
];

function EventDetailPanel({
  event,
  onClose,
}: {
  event: SystemEvent;
  onClose: () => void;
}) {
  return (
    <Sheet open={true} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Event Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Event Info */}
          <div className="trading-card">
            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
              Event
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <EventTypeBadge eventType={event.event_type} />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Time</span>
                <p className="font-mono text-sm">
                  {format(new Date(event.created_at), 'MMM dd, HH:mm:ss')} UTC
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="trading-card">
            <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
              Message
            </h4>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {event.message}
            </p>
          </div>

          {/* Details */}
          {event.details && Object.keys(event.details).length > 0 && (
            <div className="trading-card">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">
                Details
              </h4>
              <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto font-mono">
                {JSON.stringify(event.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const SystemEvents = () => {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const { data: events, isLoading } = useSystemEvents(
    100,
    typeFilter ? [typeFilter] : undefined
  );
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);

  return (
    <div className="min-h-screen">
      <Header
        title="System Events"
        subtitle="Engine health and error logs"
      />

      <div className="p-6 animate-fade-in">
        {/* Type Filter */}
        <div className="flex items-center gap-2 mb-6">
          {eventTypeFilters.map((filter) => (
            <Button
              key={filter.label}
              variant="ghost"
              size="sm"
              onClick={() => setTypeFilter(filter.value)}
              className={cn(
                'h-8 px-3 text-xs',
                typeFilter === filter.value
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="trading-card">
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          </div>
        ) : !events || events.length === 0 ? (
          <div className="trading-card">
            <EmptyState
              icon={AlertCircle}
              title="No events"
              description="No system events in this date range."
            />
          </div>
        ) : (
          <div className="trading-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <td className="font-mono-data whitespace-nowrap">
                        {format(new Date(event.created_at), 'MMM dd HH:mm:ss')}
                      </td>
                      <td>
                        <EventTypeBadge eventType={event.event_type} />
                      </td>
                      <td className="max-w-md truncate">{event.message}</td>
                      <td>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default SystemEvents;