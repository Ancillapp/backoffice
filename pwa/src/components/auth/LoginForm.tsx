import React, {
  FunctionComponent,
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';

import { Paper, TextField, TextFieldProps, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { Tau as TauIcon } from '../icons';

export interface LoginFormValue {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onChange?(value: Partial<LoginFormValue>): void;
  onSubmit?(value: LoginFormValue): void;
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flex: '1 1 auto',
  },
  icon: {
    width: 72,
    height: 72,
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

const LoginForm: FunctionComponent<PropsWithChildren<LoginFormProps>> = ({
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
      ): NonNullable<TextFieldProps['onInput']> =>
      event => {
        onChange?.({ email, password });
        setValue((event.target as HTMLInputElement).value);
      },
    [email, onChange, password],
  );

  const handleSubmit = useCallback<
    NonNullable<HTMLAttributes<HTMLFormElement>['onSubmit']>
  >(
    event => {
      event.preventDefault();

      onSubmit?.({ email, password });
    },
    [email, onSubmit, password],
  );

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.paper} onSubmit={handleSubmit}>
        <TauIcon color="primary" className={classes.icon} />
        <Typography variant="h4">Accedi</Typography>
        <TextField
          type="email"
          autoComplete="username"
          label="Email"
          required
          fullWidth
          onInput={handleInput(setEmail)}
          value={email}
        />
        <TextField
          type="password"
          autoComplete="current-password"
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
