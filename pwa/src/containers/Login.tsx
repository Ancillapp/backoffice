import React, { FunctionComponent, useCallback, useState } from 'react';

import { Button, FormHelperText } from '@material-ui/core';

import { useFirebase } from '../providers/FirebaseProvider';

import LoginForm, { LoginFormProps } from '../components/LoginForm';
import Loader from '../components/Loader';

const Login: FunctionComponent = () => {
  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleChange = useCallback<
    NonNullable<LoginFormProps['onChange']>
  >(() => {
    setError(undefined);
  }, []);

  const handleSubmit = useCallback<NonNullable<LoginFormProps['onSubmit']>>(
    async ({ email, password }) => {
      try {
        setLoading(true);

        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch ({ code }) {
        setLoading(false);
        setError(
          code === 'auth/invalid-email' ||
            code === 'auth/wrong-password' ||
            code === 'auth/user-not-found'
            ? 'Email o password non corretti.'
            : "C'è stato un errore non previsto, riprova più tardi.",
        );
      }
    },
    [firebase],
  );

  return (
    <LoginForm onChange={handleChange} onSubmit={handleSubmit}>
      {error && <FormHelperText error>{error}</FormHelperText>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading && <Loader size={18} />}
        Accedi
      </Button>
    </LoginForm>
  );
};

export default Login;
