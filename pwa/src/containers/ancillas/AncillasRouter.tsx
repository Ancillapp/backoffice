import React, { lazy, FunctionComponent } from 'react';

import { Helmet } from 'react-helmet';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../../components/common/TopbarLayout';

const AncillasList = lazy(() => import('./AncillasList'));
// const NewAncilla = lazy(() => import('./NewAncilla'));
// const AncillaDetail = lazy(() => import('./AncillaDetail'));

const AncillasRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet
        defaultTitle="Ancillapp Backoffice - Ancilla Domini"
        titleTemplate="Ancillapp Backoffice - Ancilla Domini - %s"
      />

      <Switch>
        <Route exact path={path}>
          <AncillasList {...props} />
        </Route>

        <Route exact path={`${path}/nuovo`}>
          {/* <NewAncilla /> */}
        </Route>

        <Route exact path={`${path}/:code`}>
          {/* <AncillaDetail /> */}
        </Route>

        <Redirect to={path} />
      </Switch>
    </>
  );
};

export default AncillasRouter;
