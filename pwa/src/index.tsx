import React from 'react';

import { createRoot } from 'react-dom/client';

import { QueryClient } from 'react-query';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import App from './containers/App';

const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});
const firebaseAuth = getAuth(firebaseApp);

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App queryClient={queryClient} firebaseAuth={firebaseAuth} />);
