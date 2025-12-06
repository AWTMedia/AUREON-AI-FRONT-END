import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Candle, CandleWithFeatures, MarketFeature } from '@/types/trading';
import { useFilters } from '@/contexts/FilterContext';

export function useCandles(limit = 100) {
  const { timeframe, dateRange } = useFilters();

  return useQuery({
    queryKey: ['candles', timeframe, dateRange.from.toISOString(), dateRange.to.toISOString(), limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candles_raw')
        .select('*')
        .eq('timeframe', timeframe)
        .gte('candle_time', dateRange.from.toISOString())
        .lte('candle_time', dateRange.to.toISOString())
        .order('candle_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as Candle[];
    },
  });
}

export function useCandlesWithFeatures(limit = 100) {
  const { timeframe, dateRange } = useFilters();

  return useQuery({
    queryKey: ['candles-with-features', timeframe, dateRange.from.toISOString(), dateRange.to.toISOString(), limit],
    queryFn: async () => {
      // Fetch candles
      const { data: candles, error: candlesError } = await supabase
        .from('candles_raw')
        .select('*')
        .eq('timeframe', timeframe)
        .gte('candle_time', dateRange.from.toISOString())
        .lte('candle_time', dateRange.to.toISOString())
        .order('candle_time', { ascending: false })
        .limit(limit);

      if (candlesError) throw candlesError;

      // Fetch features
      const { data: features, error: featuresError } = await supabase
        .from('market_features')
        .select('*')
        .eq('timeframe', timeframe)
        .gte('candle_time', dateRange.from.toISOString())
        .lte('candle_time', dateRange.to.toISOString());

      if (featuresError) throw featuresError;

      // Join on candle_time
      const featuresMap = new Map<string, MarketFeature>();
      (features || []).forEach((f) => {
        featuresMap.set(f.candle_time, f as MarketFeature);
      });

      const combined: CandleWithFeatures[] = (candles || []).map((c) => ({
        ...c as Candle,
        features: featuresMap.get(c.candle_time),
      }));

      return combined;
    },
  });
}

export function useLatestCandle() {
  const { timeframe } = useFilters();

  return useQuery({
    queryKey: ['latest-candle', timeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('candles_raw')
        .select('*')
        .eq('timeframe', timeframe)
        .order('candle_time', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Candle | null;
    },
    refetchInterval: 30000, // Refetch every 30s
  });
}