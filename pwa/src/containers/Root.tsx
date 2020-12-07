import React, {
  lazy,
  Suspense,
  useState,
  useCallback,
  FunctionComponent,
} from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import { Snackbar, Button } from '@material-ui/core';

import { useServiceWorker } from '../providers/ServiceWorkerProvider';
import { useToken } from '../providers/FirebaseProvider';

import SidebarLayout from '../components/common/SidebarLayout';
import SidebarMenu from '../components/common/SidebarMenu';
import Loader from '../components/common/Loader';
import PageSkeleton from '../components/common/PageSkeleton';
import { Role } from '../providers/ApiProvider';
import { TopbarLayoutProps } from '../components/common/TopbarLayout';

const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const UsersRouter = lazy(() => import('./users/UsersRouter'));
const SongsRouter = lazy(() => import('./songs/SongsRouter'));
const PrayersRouter = lazy(() => import('./prayers/PrayersRouter'));
const AncillasRouter = lazy(() => import('./ancillas/AncillasRouter'));
const HolyMassRouter = lazy(() => import('./holyMass/HolyMassRouter'));
const Login = lazy(() => import('./auth/Login'));
const Logout = lazy(() => import('./auth/Logout'));

const Root: FunctionComponent = () => {
  const { assetsUpdateReady, updateAssets } = useServiceWorker();

  const token = useToken();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = useCallback(() => {
    setIsUpdating(true);
    updateAssets();
  }, [updateAssets]);

  const handleMenuButtonClick = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleSidebarItemClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  if (token === undefined) {
    return <Loader />;
  }

  const commonRouteProps: Partial<TopbarLayoutProps> = {
    onMenuButtonClick: handleMenuButtonClick,
  };

  return (
    <Suspense fallback={<Loader />}>
      {(token?.claims.roles || []).includes(Role.SUPERUSER) ? (
        <Switch>
          <Route path="/disconnessione">
            <Logout />
          </Route>

          <Route>
            <SidebarLayout
              menuContent={<SidebarMenu onItemClick={handleSidebarItemClick} />}
              open={sidebarOpen}
              onClose={handleSidebarClose}
            >
              <Suspense fallback={<PageSkeleton />}>
                <Switch>
                  <Route exact path="/">
                    <Dashboard {...commonRouteProps} />
                  </Route>
                  <Route path="/utenti">
                    <UsersRouter {...commonRouteProps} />
                  </Route>
                  <Route path="/canti">
                    <SongsRouter {...commonRouteProps} />
                  </Route>
                  <Route path="/preghiere">
                    <PrayersRouter {...commonRouteProps} />
                  </Route>
                  <Route path="/ancilla-domini">
                    <AncillasRouter {...commonRouteProps} />
                  </Route>
                  <Route path="/santa-messa">
                    <HolyMassRouter {...commonRouteProps} />
                  </Route>

                  <Redirect to="/" />
                </Switch>
              </Suspense>
            </SidebarLayout>
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/accesso">
            <Login />
          </Route>

          <Redirect to="/accesso" />
        </Switch>
      )}

      <Snackbar
        open={assetsUpdateReady}
        message="Update available!"
        action={
          <Button
            color="inherit"
            size="small"
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            {isUpdating && <Loader size={18} color="secondary" />}
            Update now
          </Button>
        }
      />
    </Suspense>
  );
};

export default Root;
