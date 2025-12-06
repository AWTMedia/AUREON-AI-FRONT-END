import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MarketFeature } from '@/types/trading';
import { useFilters } from '@/contexts/FilterContext';

export function useActiveFVGs() {
  const { timeframe, dateRange } = useFilters();

  return useQuery({
    queryKey: ['active-fvgs', timeframe, dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      // FVGs Up
      const { count: upCount, error: upError } = await supabase
        .from('market_features')
        .select('*', { count: 'exact', head: true })
        .eq('timeframe', timeframe)
        .eq('fvg_up', true)
        .eq('fvg_resolved', false)
        .gte('candle_time', dateRange.from.toISOString())
        .lte('candle_time', dateRange.to.toISOString());

      if (upError) throw upError;

      // FVGs Down
      const { count: downCount, error: downError } = await supabase
        .from('market_features')
        .select('*', { count: 'exact', head: true })
        .eq('timeframe', timeframe)
        .eq('fvg_down', true)
        .eq('fvg_resolved', false)
        .gte('candle_time', dateRange.from.toISOString())
        .lte('candle_time', dateRange.to.toISOString());

      if (downError) throw downError;

      return {
        up: upCount || 0,
        down: downCount || 0,
        total: (upCount || 0) + (downCount || 0),
      };
    },
    refetchInterval: 60000,
  });
}

export function useFeaturesByCandle(candleTime: string, timeframe: string) {
  return useQuery({
    queryKey: ['features-by-candle', candleTime, timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_features')
        .select('*')
        .eq('timeframe', timeframe)
        .eq('candle_time', candleTime)
        .maybeSingle();

      if (error) throw error;
      return data as MarketFeature | null;
    },
    enabled: !!candleTime && !!timeframe,
  });
}