import React, {
  createContext,
  FunctionComponent,
  useMemo,
  useState,
  useEffect,
} from 'react';
import * as serviceWorker from '../serviceWorker';

export type ServiceWorkerContextValue =
  | {
      readonly assetsUpdateReady: boolean;
      readonly assetsCached: boolean;
      readonly updateAssets: () => void;
    }
  | undefined;

const ServiceWorkerContext = createContext<ServiceWorkerContextValue>(
  undefined,
);

const ServiceWorkerProvider: FunctionComponent = (props) => {
  const [
    waitingServiceWorker,
    setWaitingServiceWorker,
  ] = useState<ServiceWorker | null>(null);
  const [assetsUpdateReady, setAssetsUpdateReady] = useState(false);
  const [assetsCached, setAssetsCached] = useState(false);

  const value = useMemo(
    () => ({
      assetsUpdateReady,
      assetsCached,
      // Call when the user confirm update of application and reload page
      updateAssets: () => {
        if (waitingServiceWorker) {
          waitingServiceWorker.addEventListener('statechange', (event) => {
            const newSW = event?.target as ServiceWorker | undefined;

            if (newSW?.state === 'activated') {
              window.location.reload();
            }
          });

          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      },
    }),
    [assetsUpdateReady, assetsCached, waitingServiceWorker],
  );

  // Once on component mounted subscribe to Update and Succes events in
  // CRA's service worker wrapper
  useEffect(() => {
    serviceWorker.register({
      onUpdate: (registration) => {
        setWaitingServiceWorker(registration.waiting);
        setAssetsUpdateReady(true);
      },
      onSuccess: () => {
        setAssetsCached(true);
      },
    });
  }, []);

  return <ServiceWorkerContext.Provider value={value} {...props} />;
};

export const useServiceWorker = (): NonNullable<ServiceWorkerContextValue> => {
  const context = React.useContext(ServiceWorkerContext);

  if (!context) {
    throw new Error(
      'useServiceWorker must be used within a ServiceWorkerProvider',
    );
  }

  return context;
};

export default ServiceWorkerProvider;
