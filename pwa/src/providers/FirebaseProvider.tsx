import React, {
  FunctionComponent,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import type { app, User } from 'firebase';

export interface FirebaseProviderProps {
  firebase: app.App;
}

export const FirebaseContext = createContext<app.App | undefined>(undefined);

export const FirebaseProvider: FunctionComponent<FirebaseProviderProps> = ({
  firebase,
  children,
}) => (
  <FirebaseContext.Provider value={firebase}>
    {children}
  </FirebaseContext.Provider>
);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }

  return context;
};

export const useUser = () => {
  const firebase = useFirebase();

  const auth = firebase.auth();

  const [user, setUser] = useState<User | undefined>(
    auth.currentUser || undefined,
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((nextUser) =>
      setUser(nextUser || undefined),
    );

    return () => unsubscribe();
  }, []);

  return user;
};

export default FirebaseProvider;
