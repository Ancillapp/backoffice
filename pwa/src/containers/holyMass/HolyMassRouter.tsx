import React, { FunctionComponent } from 'react';

import { Helmet } from 'react-helmet';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../../components/common/TopbarLayout';

const HolyMassRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet
        defaultTitle="Ancillapp Backoffice - Santa Messa"
        titleTemplate="Ancillapp Backoffice - Santa Messa - %s"
      />

      <Switch>
        <Route exact path={path}>
          <h1>Santa Messa</h1>
        </Route>

        <Redirect to={path} />
      </Switch>
    </>
  );
};

export default HolyMassRouter;
