import React, { FunctionComponent } from 'react';

import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';

import { Skeleton } from '@material-ui/lab';

import CloseIcon from '@material-ui/icons/Close';

import { Role, User } from '../providers/ApiProvider';

import ProviderIcon from './ProviderIcon';

export interface UsersProps {
  items?: User[];
  loading?: boolean;
}

const dateTimeFormatter = new Intl.DateTimeFormat('it', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const useStyles = makeStyles((theme) => ({
  email: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  notVerifiedCheck: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(1),
  },
}));

const roleTranslationMap: Record<Role, string> = {
  [Role.USER]: 'Utente',
  [Role.SUPERUSER]: 'Superuser',
};

const Users: FunctionComponent<UsersProps> = ({ items, loading }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell>Data creazione</TableCell>
            <TableCell>Data ultimo accesso</TableCell>
            <TableCell>Ruolo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: 20 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width={192} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={72} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={96} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={96} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={96} />
                  </TableCell>
                </TableRow>
              ))
            : items?.map(
                ({
                  id,
                  email,
                  verified,
                  providers,
                  createdAt,
                  lastLoggedInAt,
                  roles,
                }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <span className={classes.email}>
                        {email}
                        {!verified && (
                          <Tooltip title="Email non verificata">
                            <CloseIcon className={classes.notVerifiedCheck} />
                          </Tooltip>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {providers.map((provider) => (
                        <ProviderIcon key={provider} provider={provider} />
                      ))}
                    </TableCell>
                    <TableCell>
                      {dateTimeFormatter.format(new Date(createdAt))}
                    </TableCell>
                    <TableCell>
                      {dateTimeFormatter.format(new Date(lastLoggedInAt))}
                    </TableCell>
                    <TableCell>
                      {roles.map((role) => roleTranslationMap[role]).join(', ')}
                    </TableCell>
                  </TableRow>
                ),
              )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;
