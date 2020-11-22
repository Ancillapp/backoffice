import React from 'react';

import ReactDOM from 'react-dom';

import firebase from 'firebase/app';
import 'firebase/auth';

import App from './containers/App';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

ReactDOM.render(<App firebase={firebase} />, document.getElementById('root'));
