import React, { FunctionComponent } from 'react';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import DashboardLayout from '../components/DashboardLayout';
import CounterCard from '../components/CounterCard';
import GrowingLink from '../components/GrowingLink';
import {
  useAncillasCount,
  useSessions,
  usePrayersCount,
  useSongsCount,
} from '../providers/ApiProvider';
import Masonry from '../components/Masonry';
import SessionsChartCard from '../components/SessionsChartCard';

const Dashboard: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { data: sessionsData, error: sessionsError } = useSessions();
  const { data: songsCountData, error: songsCountError } = useSongsCount();
  const {
    data: prayersCountData,
    error: prayersCountError,
  } = usePrayersCount();
  const {
    data: ancillasCountData,
    error: ancillasCountError,
  } = useAncillasCount();

  const error =
    sessionsError || songsCountError || prayersCountError || ancillasCountError;

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <TopbarLayout title="Dashboard" {...props}>
      <DashboardLayout>
        <Masonry container spacing={3}>
          <Masonry item md={8}>
            <SessionsChartCard data={sessionsData} />
          </Masonry>
          <Masonry item md={4}>
            <GrowingLink to="/canti">
              <CounterCard title="Canti" value={songsCountData?.count} />
            </GrowingLink>
          </Masonry>
          <Masonry item md={4}>
            <GrowingLink to="/preghiere">
              <CounterCard title="Preghiere" value={prayersCountData?.count} />
            </GrowingLink>
          </Masonry>
          <Masonry item md={4}>
            <GrowingLink to="/ancilla-domini">
              <CounterCard
                title="Ancilla Domini"
                value={ancillasCountData?.count}
              />
            </GrowingLink>
          </Masonry>
        </Masonry>
      </DashboardLayout>
    </TopbarLayout>
  );
};

export default Dashboard;
