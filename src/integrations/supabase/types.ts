export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_logs: {
        Row: {
          candle_time: string
          created_at: string
          direction: string | null
          id: string
          meta_json: Json | null
          reasoning: string
          signal_type: string | null
          timeframe: string
        }
        Insert: {
          candle_time: string
          created_at?: string
          direction?: string | null
          id?: string
          meta_json?: Json | null
          reasoning: string
          signal_type?: string | null
          timeframe: string
        }
        Update: {
          candle_time?: string
          created_at?: string
          direction?: string | null
          id?: string
          meta_json?: Json | null
          reasoning?: string
          signal_type?: string | null
          timeframe?: string
        }
        Relationships: []
      }
      candles_raw: {
        Row: {
          candle_time: string
          close: number
          created_at: string
          high: number
          id: string
          low: number
          open: number
          symbol: string
          timeframe: string
          volume: number | null
        }
        Insert: {
          candle_time: string
          close: number
          created_at?: string
          high: number
          id?: string
          low: number
          open: number
          symbol?: string
          timeframe: string
          volume?: number | null
        }
        Update: {
          candle_time?: string
          close?: number
          created_at?: string
          high?: number
          id?: string
          low?: number
          open?: number
          symbol?: string
          timeframe?: string
          volume?: number | null
        }
        Relationships: []
      }
      market_features: {
        Row: {
          bos_down: boolean | null
          bos_up: boolean | null
          candle_id: string | null
          candle_time: string
          created_at: string
          equal_highs: boolean | null
          equal_lows: boolean | null
          fvg_down: boolean | null
          fvg_gap_size: number | null
          fvg_resolved: boolean | null
          fvg_up: boolean | null
          id: string
          mss_down: boolean | null
          mss_up: boolean | null
          og_down: boolean | null
          og_resolved: boolean | null
          og_up: boolean | null
          swept_high: boolean | null
          swept_low: boolean | null
          swing_high: boolean | null
          swing_low: boolean | null
          timeframe: string
          vi_down: boolean | null
          vi_resolved: boolean | null
          vi_up: boolean | null
        }
        Insert: {
          bos_down?: boolean | null
          bos_up?: boolean | null
          candle_id?: string | null
          candle_time: string
          created_at?: string
          equal_highs?: boolean | null
          equal_lows?: boolean | null
          fvg_down?: boolean | null
          fvg_gap_size?: number | null
          fvg_resolved?: boolean | null
          fvg_up?: boolean | null
          id?: string
          mss_down?: boolean | null
          mss_up?: boolean | null
          og_down?: boolean | null
          og_resolved?: boolean | null
          og_up?: boolean | null
          swept_high?: boolean | null
          swept_low?: boolean | null
          swing_high?: boolean | null
          swing_low?: boolean | null
          timeframe: string
          vi_down?: boolean | null
          vi_resolved?: boolean | null
          vi_up?: boolean | null
        }
        Update: {
          bos_down?: boolean | null
          bos_up?: boolean | null
          candle_id?: string | null
          candle_time?: string
          created_at?: string
          equal_highs?: boolean | null
          equal_lows?: boolean | null
          fvg_down?: boolean | null
          fvg_gap_size?: number | null
          fvg_resolved?: boolean | null
          fvg_up?: boolean | null
          id?: string
          mss_down?: boolean | null
          mss_up?: boolean | null
          og_down?: boolean | null
          og_resolved?: boolean | null
          og_up?: boolean | null
          swept_high?: boolean | null
          swept_low?: boolean | null
          swing_high?: boolean | null
          swing_low?: boolean | null
          timeframe?: string
          vi_down?: boolean | null
          vi_resolved?: boolean | null
          vi_up?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "market_features_candle_id_fkey"
            columns: ["candle_id"]
            isOneToOne: false
            referencedRelation: "candles_raw"
            referencedColumns: ["id"]
          },
        ]
      }
      system_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          message: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          message: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          message?: string
        }
        Relationships: []
      }
      trade_signals: {
        Row: {
          candle_time: string
          created_at: string
          direction: string | null
          id: string
          meta_json: Json | null
          signal_type: string | null
          timeframe: string
        }
        Insert: {
          candle_time: string
          created_at?: string
          direction?: string | null
          id?: string
          meta_json?: Json | null
          signal_type?: string | null
          timeframe: string
        }
        Update: {
          candle_time?: string
          created_at?: string
          direction?: string | null
          id?: string
          meta_json?: Json | null
          signal_type?: string | null
          timeframe?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
