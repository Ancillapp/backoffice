import React, { FunctionComponent, useCallback, useState } from 'react';

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

import { Button, FormHelperText, Typography } from '@mui/material';

import { useFirebase } from '../../providers/FirebaseProvider';

import LoginForm, { LoginFormProps } from '../../components/auth/LoginForm';
import Loader from '../../components/common/Loader';
import { Role } from '../../providers/ApiProvider';

const Login: FunctionComponent = () => {
  const { auth } = useFirebase();

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
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const token = await user?.getIdTokenResult();

        if (
          !((token?.claims.roles as string[]) || []).includes(Role.SUPERUSER)
        ) {
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
    [auth],
  );

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);

      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());

      const token = await user?.getIdTokenResult();

      if (!((token?.claims.roles as string[]) || []).includes(Role.SUPERUSER)) {
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
  }, [auth]);

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
