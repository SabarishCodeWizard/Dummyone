import { useState } from 'react';
import { ErrorState, LoadingState, Page, SelectField } from '@/ui';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { TrendingUp } from 'lucide-react';
import { fetchDashboardData } from './dashboardAnalytics';
import { DashboardCharts } from './components/DashboardCharts';
import { FirestoreUsageSection } from './components/FirestoreUsageSection';

const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisQuarter', label: 'This Quarter' },
  { value: 'thisYear', label: 'This Year' },
];

export default function StatisticsPage() {
  const [data, setData] = useState(null);
  const [rangeKey, setRangeKey] = useState('thisMonth');

  const { loading, error, reload } = useFocusLoad(async () => {
    try {
      const res = await fetchDashboardData();
      setData(res);
    } catch (e) {
      console.error('Error loading dashboard data:', e);
      throw new Error('Error loading analytics data.');
    }
  });

  return (
    <Page
      title="Business Statistics"
      icon={TrendingUp}
      actions={
        <SelectField
          aria-label="Period"
          value={rangeKey}
          onChange={setRangeKey}
          options={RANGE_OPTIONS}
          className="w-36"
        />
      }
    >
      <p className="-mt-1 mb-5 text-sm text-slate-500">
        Monitor sales, purchases, profit, inventory and cash flow from one place.
      </p>

      {loading && !data && <LoadingState label="Loading statistics…" />}

      {error && !data && <ErrorState message={error} onRetry={() => void reload()} />}

      {data && (
        <div className="animate-fade-in space-y-6">
          <DashboardCharts data={data} rangeKey={rangeKey} />
          <FirestoreUsageSection data={data} />
        </div>
      )}
    </Page>
  );
}
