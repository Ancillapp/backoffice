import React, { FunctionComponent } from 'react';

import { Helmet } from 'react-helmet';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import CounterCard from '../../components/common/CounterCard';
import GrowingLink from '../../components/common/GrowingLink';
import {
  useAncillasCount,
  useSessions,
  usePrayersCount,
  useSongsCount,
  useTotalSessions,
  useUsersCount,
  useNextDaysHolyMassesBookings,
} from '../../providers/ApiProvider';
import Masonry from '../../components/common/Masonry';
import SessionsChartCard from '../../components/dashboard/SessionsChartCard';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import {
  dateFormatter,
  dateTimeFormatter,
  toLocalTimeZone,
} from '../../helpers/dates';

const serviceStartDate = dateFormatter.format(
  new Date('2020-05-01T00:00:00.000+0200'),
);

const Dashboard: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { data: sessionsData, error: sessionsError } = useSessions();
  const {
    data: totalSessionsData,
    error: totalSessionsError,
  } = useTotalSessions();
  const { data: usersCountData, error: usersCountError } = useUsersCount();
  const { data: songsCountData, error: songsCountError } = useSongsCount();
  const {
    data: prayersCountData,
    error: prayersCountError,
  } = usePrayersCount();
  const {
    data: ancillasCountData,
    error: ancillasCountError,
  } = useAncillasCount();
  const {
    data: nextThreeDaysHolyMassesBookingsData,
    error: nextThreeDaysHolyMassesBookingsError,
  } = useNextDaysHolyMassesBookings();

  // TODO: improve error handling (handle it per API call)
  const error =
    sessionsError ||
    totalSessionsError ||
    usersCountError ||
    songsCountError ||
    prayersCountError ||
    ancillasCountError ||
    nextThreeDaysHolyMassesBookingsError;

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <TopbarLayout title="Dashboard" {...props}>
        <DashboardLayout>
          <Masonry container spacing={3}>
            <Masonry item md={8}>
              <SessionsChartCard data={sessionsData} />
            </Masonry>
            <Masonry item md={4}>
              <CounterCard
                title="Sessioni"
                subtitle={
                  <>
                    Totali <small>(dal {serviceStartDate})</small>
                  </>
                }
                value={totalSessionsData?.count}
              />
            </Masonry>
            <Masonry item md={4}>
              <GrowingLink to="/utenti">
                <CounterCard title="Utenti" value={usersCountData?.count} />
              </GrowingLink>
            </Masonry>
            <Masonry item md={4}>
              <GrowingLink to="/canti">
                <CounterCard title="Canti" value={songsCountData?.count} />
              </GrowingLink>
            </Masonry>
            <Masonry item md={4}>
              <GrowingLink to="/preghiere">
                <CounterCard
                  title="Preghiere"
                  value={prayersCountData?.count}
                />
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
            <Masonry item md={8}>
              <Card>
                <CardHeader
                  title="Prenotazioni Santa Messa"
                  subheader="Prossimi tre giorni"
                />
                <CardContent>
                  <List>
                    {nextThreeDaysHolyMassesBookingsData?.map(
                      ({ date, fraternity, bookings }) => (
                        <ListItem key={`${fraternity.id}-${date}`}>
                          <ListItemText
                            primary={fraternity.location}
                            secondary={dateTimeFormatter.format(
                              toLocalTimeZone(new Date(date)),
                            )}
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="h5">
                              {bookings}/{fraternity.seats}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ),
                    ) ||
                      Array.from({ length: 3 }, (_, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={<Skeleton variant="text" width={72} />}
                            secondary={<Skeleton variant="text" width={54} />}
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="h5">
                              <Skeleton variant="text" width={40} />
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Masonry>
          </Masonry>
        </DashboardLayout>
      </TopbarLayout>
    </>
  );
};

export default Dashboard;
