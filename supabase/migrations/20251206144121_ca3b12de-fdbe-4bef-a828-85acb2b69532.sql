-- Create candles_raw table for OHLCV data
CREATE TABLE public.candles_raw (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL DEFAULT 'XAUUSD',
  timeframe TEXT NOT NULL,
  open DECIMAL(18,6) NOT NULL,
  high DECIMAL(18,6) NOT NULL,
  low DECIMAL(18,6) NOT NULL,
  close DECIMAL(18,6) NOT NULL,
  volume DECIMAL(18,6) DEFAULT 0,
  candle_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_candles_raw_timeframe_time ON public.candles_raw(timeframe, candle_time DESC);
CREATE INDEX idx_candles_raw_symbol ON public.candles_raw(symbol);

-- Create market_features table for detector outputs
CREATE TABLE public.market_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candle_id UUID REFERENCES public.candles_raw(id) ON DELETE CASCADE,
  timeframe TEXT NOT NULL,
  candle_time TIMESTAMPTZ NOT NULL,
  -- Imbalance/FVG flags
  fvg_up BOOLEAN DEFAULT false,
  fvg_down BOOLEAN DEFAULT false,
  fvg_resolved BOOLEAN DEFAULT false,
  fvg_gap_size DECIMAL(18,6) DEFAULT 0,
  og_up BOOLEAN DEFAULT false,
  og_down BOOLEAN DEFAULT false,
  og_resolved BOOLEAN DEFAULT false,
  vi_up BOOLEAN DEFAULT false,
  vi_down BOOLEAN DEFAULT false,
  vi_resolved BOOLEAN DEFAULT false,
  -- Structure flags
  swing_high BOOLEAN DEFAULT false,
  swing_low BOOLEAN DEFAULT false,
  bos_up BOOLEAN DEFAULT false,
  bos_down BOOLEAN DEFAULT false,
  mss_up BOOLEAN DEFAULT false,
  mss_down BOOLEAN DEFAULT false,
  -- Sweep flags
  swept_high BOOLEAN DEFAULT false,
  swept_low BOOLEAN DEFAULT false,
  equal_highs BOOLEAN DEFAULT false,
  equal_lows BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_market_features_timeframe_time ON public.market_features(timeframe, candle_time DESC);
CREATE INDEX idx_market_features_candle_id ON public.market_features(candle_id);

-- Create trade_signals table
CREATE TABLE public.trade_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candle_time TIMESTAMPTZ NOT NULL,
  timeframe TEXT NOT NULL,
  signal_type TEXT, -- 'ENTRY', 'EXIT', 'NONE', null
  direction TEXT, -- 'LONG', 'SHORT', null
  meta_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trade_signals_timeframe_time ON public.trade_signals(timeframe, candle_time DESC);
CREATE INDEX idx_trade_signals_type ON public.trade_signals(signal_type);

-- Create ai_logs table for AI reasoning
CREATE TABLE public.ai_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candle_time TIMESTAMPTZ NOT NULL,
  timeframe TEXT NOT NULL,
  signal_type TEXT,
  direction TEXT,
  reasoning TEXT NOT NULL,
  meta_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_logs_timeframe_time ON public.ai_logs(timeframe, candle_time DESC);

-- Create system_events table
CREATE TABLE public.system_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL DEFAULT 'info', -- 'info', 'error', 'warning'
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_system_events_type ON public.system_events(event_type);
CREATE INDEX idx_system_events_created ON public.system_events(created_at DESC);

-- Enable RLS but allow public read access (as specified, no auth needed)
ALTER TABLE public.candles_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- Create public read policies (no auth required as specified)
CREATE POLICY "Allow public read access" ON public.candles_raw FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.market_features FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.trade_signals FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.ai_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.system_events FOR SELECT USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.candles_raw;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_features;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_signals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_events;