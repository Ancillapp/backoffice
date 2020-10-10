import React, { FunctionComponent } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@material-ui/core';

import type Firebase from 'firebase';

import lightTheme from './themes/light';
import darkTheme from './themes/dark';

import Root from './containers/Root';
import FirebaseProvider from './providers/FirebaseProvider';
import ServiceWorkerProvider from './providers/ServiceWorkerProvider';
import { useThemeName } from './providers/ThemeNameProvider';

export interface AppProps {
  firebase: typeof Firebase;
}

const App: FunctionComponent<AppProps> = ({ firebase }) => {
  const themeName = useThemeName();

  return (
    <FirebaseProvider firebase={firebase}>
      <ThemeProvider theme={themeName === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <ServiceWorkerProvider>
          <BrowserRouter>
            <Root />
          </BrowserRouter>
        </ServiceWorkerProvider>
      </ThemeProvider>
    </FirebaseProvider>
  );
};

export default App;
