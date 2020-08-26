import React, { lazy, FunctionComponent } from 'react';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../components/TopbarLayout';

const SongsList = lazy(() => import('./SongsList'));

const SongsRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <SongsList {...props} />
      </Route>

      <Route exact path={`${path}/nuovo`}>
        <h1>Nuovo canto</h1>
      </Route>

      <Route exact path={`${path}/:number`}>
        <h1>Canto</h1>
      </Route>

      <Redirect to={path} />
    </Switch>
  );
};

export default SongsRouter;
