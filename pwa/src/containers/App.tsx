import React, { FunctionComponent } from 'react';

import { Helmet } from 'react-helmet';

import { BrowserRouter } from 'react-router-dom';

import {
  StyledEngineProvider,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';

import { QueryClient, QueryClientProvider } from 'react-query';
import type { Auth } from 'firebase/auth';

import lightTheme from '../themes/light';
import darkTheme from '../themes/dark';

import Root from './Root';
import FirebaseProvider from '../providers/FirebaseProvider';
import ServiceWorkerProvider from '../providers/ServiceWorkerProvider';
import { useThemeName } from '../providers/ThemeNameProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import itLocale from 'date-fns/locale/it';

export interface AppProps {
  queryClient: QueryClient;
  firebaseAuth: Auth;
}

const App: FunctionComponent<AppProps> = ({ queryClient, firebaseAuth }) => {
  const themeName = useThemeName();

  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider auth={firebaseAuth}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeName === 'dark' ? darkTheme : lightTheme}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={itLocale}
            >
              <Helmet
                defaultTitle="Ancillapp Backoffice"
                titleTemplate="Ancillapp Backoffice - %s"
              />
              <CssBaseline />
              <ServiceWorkerProvider>
                <BrowserRouter>
                  <Root />
                </BrowserRouter>
              </ServiceWorkerProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  );
};

export default App;
