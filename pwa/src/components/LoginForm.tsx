import React, { FunctionComponent, useCallback, useState } from 'react';

import {
  makeStyles,
  Paper,
  PaperProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@material-ui/core';

export interface LoginFormValue {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onChange?(value: Partial<LoginFormValue>): void;
  onSubmit?(value: LoginFormValue): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: '1 1 auto',
  },
  icon: {
    width: 72,
    borderRadius: '50%',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    padding: theme.spacing(3),

    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
  },
}));

const LoginForm: FunctionComponent<LoginFormProps> = ({
  children,
  onChange,
  onSubmit,
}) => {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInput = useCallback(
    (
      setValue: typeof setEmail | typeof setPassword,
    ): NonNullable<TextFieldProps['onInput']> => (event) => {
      onChange?.({ email, password });
      setValue((event.target as HTMLInputElement).value);
    },
    [email, onChange, password],
  );

  const handleSubmit = useCallback<NonNullable<PaperProps['onSubmit']>>(
    (event) => {
      event.preventDefault();

      onSubmit?.({ email, password });
    },
    [email, onSubmit, password],
  );

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.paper} onSubmit={handleSubmit}>
        <img
          className={classes.icon}
          src={`${process.env.PUBLIC_URL}/images/icons/apple-touch-icon.png`}
          alt="Ancillapp Backoffice"
        />
        <Typography variant="h4">Accedi</Typography>
        <TextField
          type="email"
          autoComplete="username"
          variant="outlined"
          label="Email"
          required
          fullWidth
          onInput={handleInput(setEmail)}
          value={email}
        />
        <TextField
          type="password"
          autoComplete="current-password"
          variant="outlined"
          label="Password"
          required
          fullWidth
          onInput={handleInput(setPassword)}
          value={password}
        />
        {children}
      </Paper>
    </div>
  );
};

export default LoginForm;
