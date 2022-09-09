import React, { lazy, FunctionComponent } from 'react';

import { Helmet } from 'react-helmet';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../../components/common/TopbarLayout';

const SongsList = lazy(() => import('./SongsList'));
const NewSong = lazy(() => import('./NewSong'));
const SongDetail = lazy(() => import('./SongDetail'));

const SongsRouter: FunctionComponent<TopbarLayoutProps> = props => {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet
        defaultTitle="Ancillapp Backoffice - Canti"
        titleTemplate="Ancillapp Backoffice - Canti - %s"
      />

      <Switch>
        <Route exact path={path}>
          <SongsList {...props} />
        </Route>

        <Route exact path={`${path}/nuovo`}>
          <NewSong />
        </Route>

        <Route exact path={`${path}/:language/:category/:number`}>
          <SongDetail />
        </Route>

        <Redirect to={path} />
      </Switch>
    </>
  );
};

export default SongsRouter;
