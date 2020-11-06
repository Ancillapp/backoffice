import React, { lazy, FunctionComponent } from 'react';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../components/TopbarLayout';

const UsersList = lazy(() => import('./UsersList'));
// const UserDetail = lazy(() => import('./UserDetail'));

const UsersRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <UsersList {...props} />
      </Route>

      <Route exact path={`${path}/:id`}>
        {/* <UserDetail /> */}
      </Route>

      <Redirect to={path} />
    </Switch>
  );
};

export default UsersRouter;
