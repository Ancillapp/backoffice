import React, { FunctionComponent } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@material-ui/core';

import lightTheme from './themes/light';

import Root from './containers/Root';
import ServiceWorkerProvider from './providers/ServiceWorkerProvider';

const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <ServiceWorkerProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ServiceWorkerProvider>
  </ThemeProvider>
);

export default App;
