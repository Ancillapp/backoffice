import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Link, useLocation, useHistory } from 'react-router-dom';

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

import { SongSummary, useSongs } from '../../providers/ApiProvider';
import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Songs from '../../components/songs/Songs';
import AutosizedFab from '../../components/common/AutosizedFab';
import Loader from '../../components/common/Loader';
import { mergeSearchParams } from '../../helpers/search';

const SongsList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [displayedSongs, setDisplayedSongs] = useState<SongSummary[]>([]);
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchKeyword = searchParams.get('ricerca') || '';
  const language = searchParams.get('lingua') || 'IT';

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

    if (!fuse || !searchKeyword) {
      setDisplayedSongs(filteredSongs);
      return;
    }

    const searchResults = fuse.search(searchKeyword);

    setDisplayedSongs(searchResults.map(({ item }) => item));
  }, [filteredSongs, fuse, searchKeyword]);

  const handleSearchInput = useCallback<NonNullable<TextFieldProps['onInput']>>(
    (event) => {
      history.push({
        pathname: '/canti',
        search: mergeSearchParams(searchParams, {
          ricerca: (event.target as HTMLInputElement).value,
        }).toString(),
      });
    },
    [history, searchParams],
  );

  const clearSearch = useCallback(() => {
    history.push({
      pathname: '/canti',
      search: mergeSearchParams(searchParams, {
        ricerca: null,
      }).toString(),
    });
  }, [history, searchParams]);

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
                    {searchKeyword ? (
                      <IconButton size="small" edge="end" onClick={clearSearch}>
                        <ClearIcon />
                      </IconButton>
                    ) : (
                      <SearchIcon />
                    )}
                  </InputAdornment>
                ),
              }}
              value={searchKeyword}
              onInput={handleSearchInput}
            />
          </Box>
        }
        topbarContent={
          <Tabs
            value={language}
            {...(isNarrow ? { centered: true } : { variant: 'fullWidth' })}
          >
            <Tab
              component={Link}
              to={{
                pathname: '/canti',
                search: mergeSearchParams(searchParams, {
                  lingua: 'IT',
                }).toString(),
              }}
              value="IT"
              label="Italiano"
            />
            <Tab
              component={Link}
              to={{
                pathname: '/canti',
                search: mergeSearchParams(searchParams, {
                  lingua: 'DE',
                }).toString(),
              }}
              value="DE"
              label="Tedesco"
            />
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
