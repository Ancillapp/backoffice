import React, { FunctionComponent } from 'react';

import {
  IconButton,
  makeStyles,
  Paper,
  TableContainer,
  Tooltip,
  Skeleton,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Role, User } from '../../providers/ApiProvider';

import ProviderIcon from './ProviderIcon';
import VirtualTable from '../common/VirtualTable';

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
  root: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  table: {
    flex: '1 1 auto',
  },
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
    <TableContainer component={Paper} className={classes.root}>
      <VirtualTable
        className={classes.table}
        columns={[
          {
            key: 'email',
            title: 'Email',
            cellTemplate: ({ data: { email = '', verified = false } = {} }) =>
              loading ? (
                <Skeleton variant="text" width={192} />
              ) : (
                <span className={classes.email}>
                  {email}
                  {!verified && (
                    <Tooltip title="Email non verificata">
                      <CloseIcon className={classes.notVerifiedCheck} />
                    </Tooltip>
                  )}
                </span>
              ),
            minWidth: 224,
          },
          {
            key: 'providers',
            title: 'Provider',
            cellTemplate: ({ data: { providers = [] } = {}, loading }) =>
              loading ? (
                <Skeleton variant="text" width={48} />
              ) : (
                <>
                  {providers.map((provider) => (
                    <ProviderIcon key={provider} provider={provider} />
                  ))}
                </>
              ),
            minWidth: 92,
          },
          {
            key: 'createdAt',
            title: 'Data creazione',
            cellTemplate: ({ data: { createdAt = '' } = {}, loading }) =>
              loading ? (
                <Skeleton variant="text" width={96} />
              ) : (
                <>{dateTimeFormatter.format(new Date(createdAt))}</>
              ),
            minWidth: 128,
          },
          {
            key: 'lastLoggedInAt',
            title: 'Data ultimo accesso',
            cellTemplate: ({ data: { lastLoggedInAt = '' } = {}, loading }) =>
              loading ? (
                <Skeleton variant="text" width={96} />
              ) : (
                <>{dateTimeFormatter.format(new Date(lastLoggedInAt))}</>
              ),
            minWidth: 128,
          },
          {
            key: 'roles',
            title: 'Ruolo',
            cellTemplate: ({ data: { roles = [] } = {}, loading }) =>
              loading ? (
                <Skeleton variant="text" width={96} />
              ) : (
                <>{roles.map((role) => roleTranslationMap[role]).join(', ')}</>
              ),
            minWidth: 128,
          },
          {
            title: 'Azioni',
            cellTemplate: ({ loading }) =>
              loading ? (
                <Skeleton variant="text" width={32} />
              ) : (
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              ),
            width: 96,
            justify: 'center',
          },
        ]}
        items={items}
        loading={loading}
      />
    </TableContainer>
  );
};

export default Users;
