import React, { lazy, FunctionComponent } from 'react';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../components/TopbarLayout';

const SongsList = lazy(() => import('./SongsList'));
const NewSong = lazy(() => import('./NewSong'));
const SongDetail = lazy(() => import('./SongDetail'));

const SongsRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <SongsList {...props} />
      </Route>

      <Route exact path={`${path}/nuovo`}>
        <NewSong />
      </Route>

      <Route exact path={`${path}/:number`}>
        <SongDetail />
      </Route>

      <Redirect to={path} />
    </Switch>
  );
};

export default SongsRouter;
