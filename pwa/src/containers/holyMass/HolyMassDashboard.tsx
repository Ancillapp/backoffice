import React, { lazy, FunctionComponent, Suspense } from 'react';

import { Link, useParams, Redirect, Switch, Route } from 'react-router-dom';

import { Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Loader from '../../components/common/Loader';

const HolyMassBookings = lazy(() => import('./HolyMassBookings'));
const HolyMassTimetables = lazy(() => import('./HolyMassTimetables'));

const HolyMassDashboard: FunctionComponent<TopbarLayoutProps> = props => {
  const { section } = useParams<{ section: string }>();

  const theme = useTheme();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  if (section !== 'prenotazioni' && section !== 'orari') {
    return <Redirect to="/santa-messa/prenotazioni" />;
  }

  return (
    <TopbarLayout
      title="Santa Messa"
      topbarContent={
        <Tabs
          value={section}
          {...(isNarrow ? { centered: true } : { variant: 'fullWidth' })}
        >
          <Tab
            component={Link}
            to="/santa-messa/prenotazioni"
            value="prenotazioni"
            label="Prenotazioni"
          />
          <Tab
            component={Link}
            to="/santa-messa/orari"
            value="orari"
            label="Orari"
          />
        </Tabs>
      }
      {...props}
    >
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path="/santa-messa/prenotazioni">
            <HolyMassBookings />
          </Route>
          <Route exact path="/santa-messa/orari">
            <HolyMassTimetables />
          </Route>

          <Redirect to="/santa-messa/prenotazioni" />
        </Switch>
      </Suspense>
    </TopbarLayout>
  );
};

export default HolyMassDashboard;
