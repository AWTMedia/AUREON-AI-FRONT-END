import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AiLog } from '@/types/trading';
import { useFilters } from '@/contexts/FilterContext';
import { subHours } from 'date-fns';

export function useAiLogs(limit = 50) {
  const { timeframe, dateRange } = useFilters();

  return useQuery({
    queryKey: ['ai-logs', timeframe, dateRange.from.toISOString(), dateRange.to.toISOString(), limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_logs')
        .select('*')
        .eq('timeframe', timeframe)
        .gte('candle_time', dateRange.from.toISOString())
        .lte('candle_time', dateRange.to.toISOString())
        .order('candle_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as AiLog[];
    },
  });
}

export function useRecentAiLogs(limit = 5) {
  const { timeframe } = useFilters();

  return useQuery({
    queryKey: ['recent-ai-logs', timeframe, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_logs')
        .select('*')
        .eq('timeframe', timeframe)
        .order('candle_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as AiLog[];
    },
    refetchInterval: 30000,
  });
}

export function useAiLogsToday() {
  const { timeframe } = useFilters();
  const last24h = subHours(new Date(), 24).toISOString();

  return useQuery({
    queryKey: ['ai-logs-today', timeframe, last24h],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('ai_logs')
        .select('*', { count: 'exact', head: true })
        .eq('timeframe', timeframe)
        .gte('candle_time', last24h);

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 60000,
  });
}