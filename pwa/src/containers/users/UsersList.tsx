import React, {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import Fuse from 'fuse.js';

import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import { User, useUsers } from '../../providers/ApiProvider';
import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Users from '../../components/users/Users';

const UsersList: FunctionComponent<TopbarLayoutProps> = (props) => {
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
    (event) => {
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
        <Box width={192} clone>
          <TextField
            type="search"
            size="small"
            variant="outlined"
            placeholder="Cerca"
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
        </Box>
      }
      {...props}
    >
      <Users items={displayedUsers} loading={loading} />
    </TopbarLayout>
  );
};

export default UsersList;
