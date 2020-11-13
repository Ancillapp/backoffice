import React, { lazy, FunctionComponent } from 'react';

import { Helmet } from 'react-helmet';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../components/TopbarLayout';

const PrayersList = lazy(() => import('./PrayersList'));
// const NewPrayer = lazy(() => import('./NewPrayer'));
// const PrayerDetail = lazy(() => import('./PrayerDetail'));

const PrayersRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet
        defaultTitle="Ancillapp Backoffice - Preghiere"
        titleTemplate="Ancillapp Backoffice - Preghiere - %s"
      />

      <Switch>
        <Route exact path={path}>
          <PrayersList {...props} />
        </Route>

        <Route exact path={`${path}/nuova`}>
          {/* <NewPrayer /> */}
        </Route>

        <Route exact path={`${path}/:slug`}>
          {/* <PrayerDetail /> */}
        </Route>

        <Redirect to={path} />
      </Switch>
    </>
  );
};

export default PrayersRouter;
