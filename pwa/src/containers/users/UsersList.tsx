import React, {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import Fuse from 'fuse.js';

import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';

import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

import { User, useUsers } from '../../providers/ApiProvider';
import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Users from '../../components/users/Users';
import CenteredLayout from '../../components/common/CenteredLayout';

const UsersList: FunctionComponent<TopbarLayoutProps> = props => {
  const [search, setSearch] = useState('');
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

  const { data, loading, error } = useUsers();

  const fuse = useMemo<Fuse<User> | null>(
    () =>
      data
        ? new Fuse(data, {
            keys: [
              'email',
              'createdAt',
              'lastLoggedInAt',
              'roles',
              'providers',
            ],
          })
        : null,
    [data],
  );

  useEffect(() => {
    if (!data) {
      setDisplayedUsers([]);
      return;
    }

    if (!fuse || !search) {
      setDisplayedUsers(data);
      return;
    }

    const searchResults = fuse.search(search);

    setDisplayedUsers(searchResults.map(({ item }) => item));
  }, [data, fuse, search]);

  const handleSearchInput = useCallback<NonNullable<TextFieldProps['onInput']>>(
    event => {
      setSearch((event.target as HTMLInputElement).value);
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearch('');
  }, []);

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <TopbarLayout
      title="Utenti"
      endAdornment={
        <TextField
          type="search"
          size="small"
          placeholder="Cerca"
          sx={{ width: 192 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {search ? (
                  <IconButton size="small" edge="end" onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            ),
          }}
          value={search}
          onInput={handleSearchInput}
        />
      }
      {...props}
    >
      <CenteredLayout>
        <Users items={displayedUsers} loading={loading} />
      </CenteredLayout>
    </TopbarLayout>
  );
};

export default UsersList;
