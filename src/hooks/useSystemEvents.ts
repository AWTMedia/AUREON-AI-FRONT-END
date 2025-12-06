import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemEvent } from '@/types/trading';
import { useFilters } from '@/contexts/FilterContext';

export function useSystemEvents(limit = 50, eventTypes?: string[]) {
  const { dateRange } = useFilters();

  return useQuery({
    queryKey: ['system-events', dateRange.from.toISOString(), dateRange.to.toISOString(), limit, eventTypes],
    queryFn: async () => {
      let query = supabase
        .from('system_events')
        .select('*')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (eventTypes && eventTypes.length > 0) {
        query = query.in('event_type', eventTypes);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as SystemEvent[];
    },
  });
}

export function useLatestEvent() {
  return useQuery({
    queryKey: ['latest-event'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as SystemEvent | null;
    },
    refetchInterval: 10000,
  });
}