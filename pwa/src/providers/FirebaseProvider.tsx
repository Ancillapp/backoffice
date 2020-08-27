import React, {
  FunctionComponent,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import type { app, auth, User } from 'firebase';

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

  const [user, setUser] = useState<User | null | undefined>(
    auth.currentUser || undefined,
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((nextUser) =>
      setUser(nextUser || null),
    );

    return () => unsubscribe();
  }, [auth]);

  return user;
};

export interface Token extends Omit<auth.IdTokenResult, 'claims'> {
  claims: {
    role: string;
  };
}

export const useToken = () => {
  const user = useUser();

  const [token, setToken] = useState<Token | null | undefined>(undefined);

  useEffect(() => {
    const handleRoles = async (): Promise<void> => {
      if (user === null) {
        setToken(null);
        return;
      }

      const data = await user?.getIdTokenResult();

      setToken(data as Token | undefined);
    };

    handleRoles();
  }, [user]);

  return token;
};

export default FirebaseProvider;
