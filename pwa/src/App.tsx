import React, { FunctionComponent, useEffect, useState } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider, CssBaseline, Theme } from '@material-ui/core';

import type Firebase from 'firebase';

import lightTheme from './themes/light';
import darkTheme from './themes/dark';

import Root from './containers/Root';
import FirebaseProvider from './providers/FirebaseProvider';
import ServiceWorkerProvider from './providers/ServiceWorkerProvider';

export interface AppProps {
  firebase: typeof Firebase;
}

const initialTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches
  ? darkTheme
  : lightTheme;

const App: FunctionComponent<AppProps> = ({ firebase }) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent): ReturnType<typeof setTheme> =>
      setTheme(e.matches ? darkTheme : lightTheme);

    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    mql.addEventListener('change', listener);

    return () => mql.removeEventListener('change', listener);
  }, []);

  return (
    <FirebaseProvider firebase={firebase}>
      <ThemeProvider theme={theme}>
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
