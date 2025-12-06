import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TradeSignal } from '@/types/trading';
import { useFilters } from '@/contexts/FilterContext';
import { startOfDay } from 'date-fns';

export function useSignals(limit = 50) {
  const { timeframe, dateRange } = useFilters();

  return useQuery({
    queryKey: ['signals', timeframe, dateRange.from.toISOString(), dateRange.to.toISOString(), limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_signals')
        .select('*')
        .eq('timeframe', timeframe)
        .gte('candle_time', dateRange.from.toISOString())
        .lte('candle_time', dateRange.to.toISOString())
        .order('candle_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as TradeSignal[];
    },
  });
}

export function useLatestValidSignal() {
  const { timeframe } = useFilters();

  return useQuery({
    queryKey: ['latest-valid-signal', timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_signals')
        .select('*')
        .eq('timeframe', timeframe)
        .not('signal_type', 'is', null)
        .neq('signal_type', 'NONE')
        .order('candle_time', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as TradeSignal | null;
    },
    refetchInterval: 30000,
  });
}

export function useSignalsToday() {
  const { timeframe } = useFilters();
  const todayStart = startOfDay(new Date()).toISOString();

  return useQuery({
    queryKey: ['signals-today', timeframe, todayStart],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('trade_signals')
        .select('*', { count: 'exact' })
        .eq('timeframe', timeframe)
        .gte('candle_time', todayStart);

      if (error) throw error;

      const total = count || 0;
      const actionable = (data || []).filter(
        (s) => s.signal_type && s.signal_type !== 'NONE'
      ).length;

      return { total, actionable };
    },
    refetchInterval: 60000,
  });
}