import React, {
  FunctionComponent,
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';

import type { Auth, IdTokenResult, User } from 'firebase/auth';

export interface FirebaseProviderProps {
  auth: Auth;
}

export const FirebaseContext = createContext<FirebaseProviderProps | undefined>(
  undefined,
);

export const FirebaseProvider: FunctionComponent<
  PropsWithChildren<FirebaseProviderProps>
> = ({ auth, children }) => (
  <FirebaseContext.Provider value={{ auth }}>
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
  const { auth } = useFirebase();

  const [user, setUser] = useState<User | null | undefined>(
    auth.currentUser || undefined,
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(nextUser =>
      setUser(nextUser || null),
    );

    return () => unsubscribe();
  }, [auth]);

  return user;
};

export interface Token extends Omit<IdTokenResult, 'claims'> {
  claims: {
    roles?: string[];
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
