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

import SidebarLayout from '../components/SidebarLayout';
import SidebarMenu from '../components/SidebarMenu';
import Loader from '../components/Loader';
import PageSkeleton from '../components/PageSkeleton';

const Dashboard = lazy(() => import('./Dashboard'));
const UsersRouter = lazy(() => import('./UsersRouter'));
const SongsRouter = lazy(() => import('./SongsRouter'));
const PrayersRouter = lazy(() => import('./PrayersRouter'));
const AncillasRouter = lazy(() => import('./AncillasRouter'));
const Login = lazy(() => import('./Login'));
const Logout = lazy(() => import('./Logout'));

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

  return (
    <Suspense fallback={<Loader />}>
      {token?.claims.role === 'SUPERUSER' ? (
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
                    <Dashboard onMenuButtonClick={handleMenuButtonClick} />
                  </Route>
                  <Route path="/utenti">
                    <UsersRouter onMenuButtonClick={handleMenuButtonClick} />
                  </Route>
                  <Route path="/canti">
                    <SongsRouter onMenuButtonClick={handleMenuButtonClick} />
                  </Route>
                  <Route path="/preghiere">
                    <PrayersRouter onMenuButtonClick={handleMenuButtonClick} />
                  </Route>
                  <Route path="/ancilla-domini">
                    <AncillasRouter onMenuButtonClick={handleMenuButtonClick} />
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
