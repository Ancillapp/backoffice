import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';

import { SongSummary, useSongs } from '../providers/ApiProvider';
import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Songs from '../components/Songs';
import AutosizedFab from '../components/FloatingActionButton';
import Loader from '../components/Loader';

const SongsList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [search, setSearch] = useState('');
  const [displayedSongs, setDisplayedSongs] = useState<SongSummary[]>([]);

  const { loading, data, error } = useSongs();

  useEffect(() => {
    if (!data) {
      setDisplayedSongs([]);
      return;
    }

    // TODO: use fuzzy search (fuse.js)
    setDisplayedSongs(
      search
        ? data.filter(
            ({ number, title }) =>
              number.toLowerCase().includes(search.toLowerCase()) ||
              title.toLowerCase().includes(search.toLowerCase()),
          )
        : data,
    );
  }, [data, search]);

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
    <>
      <TopbarLayout
        title="Canti"
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
        {loading ? <Loader /> : <Songs items={displayedSongs} />}
      </TopbarLayout>

      <Link to="/canti/nuovo">
        <AutosizedFab>
          <AddIcon />
        </AutosizedFab>
      </Link>
    </>
  );
};

export default SongsList;
