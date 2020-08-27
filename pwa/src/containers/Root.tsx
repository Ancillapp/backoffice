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

import SidebarLayout from '../components/SidebarLayout';
import SidebarMenu from '../components/SidebarMenu';
import Loader from '../components/Loader';

import SongsRouter from './SongsRouter';

const Dashboard = lazy(() => import('./Dashboard'));

const Root: FunctionComponent = () => {
  const { assetsUpdateReady, updateAssets } = useServiceWorker();

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

  return (
    <>
      <SidebarLayout
        menuContent={<SidebarMenu onItemClick={handleSidebarItemClick} />}
        open={sidebarOpen}
        onClose={handleSidebarClose}
      >
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/">
              <Dashboard onMenuButtonClick={handleMenuButtonClick} />
            </Route>
            <Route path="/canti">
              <SongsRouter onMenuButtonClick={handleMenuButtonClick} />
            </Route>

            <Redirect to="/" />
          </Switch>
        </Suspense>
      </SidebarLayout>

      <Snackbar
        open={assetsUpdateReady}
        message="Update available!"
        action={
          <Button
            color="secondary"
            size="small"
            autoFocus
            disabled={isUpdating}
            onClick={handleUpdate}
          >
            {isUpdating && <Loader size={24} color="secondary" />}
            Update now
          </Button>
        }
      />
    </>
  );
};

export default Root;
