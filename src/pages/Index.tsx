import { Header } from '@/components/layout/Header';
import { LatestCandleCard } from '@/components/dashboard/LatestCandleCard';
import { LatestSignalCard } from '@/components/dashboard/LatestSignalCard';
import { SignalsTodayCard } from '@/components/dashboard/SignalsTodayCard';
import { ActiveFVGsCard } from '@/components/dashboard/ActiveFVGsCard';
import { AiLogsTodayCard } from '@/components/dashboard/AiLogsTodayCard';
import { PriceChart } from '@/components/charts/PriceChart';
import { RecentSignalsTable } from '@/components/dashboard/RecentSignalsTable';
import { RecentAiLogs } from '@/components/dashboard/RecentAiLogs';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header title="Overview Dashboard" subtitle="Real-time trading analytics" />

      <div className="p-6 space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <LatestCandleCard />
          <LatestSignalCard />
          <SignalsTodayCard />
          <ActiveFVGsCard />
          <AiLogsTodayCard />
        </div>

        {/* Price Chart */}
        <PriceChart />

        {/* Recent Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentSignalsTable />
          <RecentAiLogs />
        </div>
      </div>
    </div>
  );
};

export default Index;