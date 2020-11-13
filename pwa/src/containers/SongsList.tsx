import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import Fuse from 'fuse.js';

import {
  Box,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  useMediaQuery,
  useTheme,
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
  const [language, setLanguage] = useState('IT');
  const [displayedSongs, setDisplayedSongs] = useState<SongSummary[]>([]);

  const theme = useTheme();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const { loading, data, error } = useSongs();

  const filteredSongs = useMemo<SongSummary[] | null>(
    () => data?.filter(({ number }) => number.startsWith(language)) ?? null,
    [data, language],
  );

  const fuse = useMemo<Fuse<SongSummary> | null>(
    () =>
      filteredSongs
        ? new Fuse(filteredSongs, { keys: ['number', 'title'] })
        : null,
    [filteredSongs],
  );

  useEffect(() => {
    if (!filteredSongs) {
      setDisplayedSongs([]);
      return;
    }

    if (!fuse || !search) {
      setDisplayedSongs(filteredSongs);
      return;
    }

    const searchResults = fuse.search(search);

    setDisplayedSongs(searchResults.map(({ item }) => item));
  }, [filteredSongs, fuse, search]);

  const handleLanguageChange = useCallback(
    (_: ChangeEvent<{}>, value: string) => {
      setLanguage(value);
    },
    [],
  );

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
        topbarContent={
          <Tabs
            value={language}
            onChange={handleLanguageChange}
            {...(isNarrow ? { centered: true } : { variant: 'fullWidth' })}
          >
            <Tab label="Italiano" value="IT" />
            <Tab label="Tedesco" value="DE" />
          </Tabs>
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
