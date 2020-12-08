import React, { FunctionComponent, useCallback, useState } from 'react';

import { Button, FormHelperText, Typography } from '@material-ui/core';

import { useFirebase } from '../../providers/FirebaseProvider';

import LoginForm, { LoginFormProps } from '../../components/auth/LoginForm';
import Loader from '../../components/common/Loader';
import { Role } from '../../providers/ApiProvider';

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

        const auth = firebase.auth();

        const { user } = await auth.signInWithEmailAndPassword(email, password);

        const token = await user?.getIdTokenResult();

        if (!(token?.claims.roles || []).includes(Role.SUPERUSER)) {
          await auth.signOut();

          throw new Error('INVALID_USER');
        }
      } catch ({ code, message }) {
        setLoading(false);
        setError(
          message === 'INVALID_USER' ||
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

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);

      const auth = firebase.auth();

      const { user } = await auth.signInWithPopup(
        new firebase.auth.GoogleAuthProvider(),
      );

      const token = await user?.getIdTokenResult();

      if (!(token?.claims.roles || []).includes(Role.SUPERUSER)) {
        await auth.signOut();

        throw new Error('INVALID_USER');
      }
    } catch ({ code, message }) {
      setLoading(false);
      setError(
        message === 'INVALID_USER'
          ? 'Email o password non corretti.'
          : "C'è stato un errore non previsto, riprova più tardi.",
      );
    }
  }, [firebase]);

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
      <Typography variant="subtitle1">Oppure</Typography>
      <Button variant="contained" onClick={handleGoogleLogin}>
        Accedi con Google
      </Button>
    </LoginForm>
  );
};

export default Login;
