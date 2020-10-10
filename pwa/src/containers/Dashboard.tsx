import React, { FunctionComponent } from 'react';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import DashboardLayout from '../components/DashboardLayout';
import CounterCard from '../components/CounterCard';
import GrowingLink from '../GrowingLink';
import {
  useAncillasCount,
  usePrayersCount,
  useSongsCount,
} from '../providers/ApiProvider';

const Dashboard: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { data: songsCountData, error: songsCountError } = useSongsCount();
  const {
    data: prayersCountData,
    error: prayersCountError,
  } = usePrayersCount();
  const {
    data: ancillasCountData,
    error: ancillasCountError,
  } = useAncillasCount();

  const error = songsCountError || prayersCountError || ancillasCountError;

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <TopbarLayout title="Dashboard" {...props}>
      <DashboardLayout>
        <GrowingLink to="/canti">
          <CounterCard title="Canti" value={songsCountData?.count} />
        </GrowingLink>
        <GrowingLink to="/preghiere">
          <CounterCard title="Preghiere" value={prayersCountData?.count} />
        </GrowingLink>
        <GrowingLink to="/ancilla-domini">
          <CounterCard
            title="Ancilla Domini"
            value={ancillasCountData?.count}
          />
        </GrowingLink>
      </DashboardLayout>
    </TopbarLayout>
  );
};

export default Dashboard;
