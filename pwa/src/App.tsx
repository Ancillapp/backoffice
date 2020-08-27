import React, { FunctionComponent } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@material-ui/core';

import type { app } from 'firebase';

import lightTheme from './themes/light';

import Root from './containers/Root';
import FirebaseProvider from './providers/FirebaseProvider';
import ServiceWorkerProvider from './providers/ServiceWorkerProvider';

export interface AppProps {
  firebase: app.App;
}

const App: FunctionComponent<AppProps> = ({ firebase }) => (
  <FirebaseProvider firebase={firebase}>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <ServiceWorkerProvider>
        <BrowserRouter>
          <Root />
        </BrowserRouter>
      </ServiceWorkerProvider>
    </ThemeProvider>
  </FirebaseProvider>
);

export default App;
