// Trading data types based on Supabase schema

export interface Candle {
  id: string;
  symbol: string;
  timeframe: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  candle_time: string;
  created_at: string;
}

export interface MarketFeature {
  id: string;
  candle_id: string | null;
  timeframe: string;
  candle_time: string;
  // Imbalance/FVG
  fvg_up: boolean;
  fvg_down: boolean;
  fvg_resolved: boolean;
  fvg_gap_size: number;
  og_up: boolean;
  og_down: boolean;
  og_resolved: boolean;
  vi_up: boolean;
  vi_down: boolean;
  vi_resolved: boolean;
  // Structure
  swing_high: boolean;
  swing_low: boolean;
  bos_up: boolean;
  bos_down: boolean;
  mss_up: boolean;
  mss_down: boolean;
  // Sweeps
  swept_high: boolean;
  swept_low: boolean;
  equal_highs: boolean;
  equal_lows: boolean;
  created_at: string;
}

export interface TradeSignal {
  id: string;
  candle_time: string;
  timeframe: string;
  signal_type: string | null;
  direction: string | null;
  meta_json: {
    price?: number;
    reason?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

export interface AiLog {
  id: string;
  candle_time: string;
  timeframe: string;
  signal_type: string | null;
  direction: string | null;
  reasoning: string;
  meta_json: Record<string, unknown>;
  created_at: string;
}

export interface SystemEvent {
  id: string;
  event_type: 'info' | 'error' | 'warning';
  message: string;
  details: Record<string, unknown>;
  created_at: string;
}

export type Timeframe = '15m' | '1H' | '4H';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface CandleWithFeatures extends Candle {
  features?: MarketFeature;
}