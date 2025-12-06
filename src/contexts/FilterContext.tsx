import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Timeframe, DateRange } from '@/types/trading';
import { subHours, startOfDay, subDays } from 'date-fns';

interface FilterContextType {
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  setQuickRange: (range: 'today' | '24h' | '7d' | '30d') => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subHours(new Date(), 48),
    to: new Date(),
  });

  const setQuickRange = (range: 'today' | '24h' | '7d' | '30d') => {
    const now = new Date();
    let from: Date;

    switch (range) {
      case 'today':
        from = startOfDay(now);
        break;
      case '24h':
        from = subHours(now, 24);
        break;
      case '7d':
        from = subDays(now, 7);
        break;
      case '30d':
        from = subDays(now, 30);
        break;
    }

    setDateRange({ from, to: now });
  };

  return (
    <FilterContext.Provider
      value={{
        timeframe,
        setTimeframe,
        dateRange,
        setDateRange,
        setQuickRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}