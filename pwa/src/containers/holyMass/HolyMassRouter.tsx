import React, { lazy, FunctionComponent } from 'react';

import { Helmet } from 'react-helmet';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../../components/common/TopbarLayout';

const HolyMassDashboard = lazy(() => import('./HolyMassDashboard'));

const HolyMassRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet
        defaultTitle="Ancillapp Backoffice - Santa Messa"
        titleTemplate="Ancillapp Backoffice - Santa Messa - %s"
      />

      <Switch>
        <Route exact path={`${path}/:section?`}>
          <HolyMassDashboard {...props} />
        </Route>

        <Redirect to={path} />
      </Switch>
    </>
  );
};

export default HolyMassRouter;
