import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Link, useLocation, useHistory } from 'react-router-dom';

import Fuse from 'fuse.js';

import {
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import { SongLanguage, useSongs } from '../../providers/ApiProvider';
import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Songs from '../../components/songs/Songs';
import AutosizedFab from '../../components/common/AutosizedFab';
import Loader from '../../components/common/Loader';
import { mergeSearchParams } from '../../helpers/search';
import {
  ExtendedSongSummary,
  songCategoryToPrefixMap,
  songLanguagesArray,
} from '../../helpers/songs';

const SongsList: FunctionComponent<TopbarLayoutProps> = props => {
  const [displayedSongs, setDisplayedSongs] = useState<ExtendedSongSummary[]>(
    [],
  );
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const searchKeyword = searchParams.get('ricerca') || '';
  const language = searchParams.get('lingua') || 'it';

  const theme = useTheme();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const { loading, data, error } = useSongs();

  const filteredSongs = useMemo<ExtendedSongSummary[] | null>(
    () =>
      data
        ?.filter(song => song.language === language)
        .sort((a, b) => {
          if (a.language !== b.language) {
            return (
              songLanguagesArray.indexOf(a.language) -
              songLanguagesArray.indexOf(b.language)
            );
          }

          // If the song language is italian, make sure the categories get properly sorted
          // Note that we already checked for language equality, so the two songs are in the same language.
          // For this reason, we don't need to check also for b.language
          if (a.language === SongLanguage.ITALIAN) {
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            const categoriesDiff = songCategoryToPrefixMap[a.language]![
              a.category
            ]!.localeCompare(songCategoryToPrefixMap[b.language]![b.category]!);
            /* eslint-enable @typescript-eslint/no-non-null-assertion */
            if (categoriesDiff !== 0) {
              return categoriesDiff;
            }
          }

          const normalizedNumberA = a.number
            .replace('bis', '')
            .padStart(5, '0');
          const normalizedNumberB = b.number
            .replace('bis', '')
            .padStart(5, '0');

          if (normalizedNumberA.startsWith(normalizedNumberB)) {
            return normalizedNumberA.endsWith('bis') ? -1 : 1;
          }

          return normalizedNumberA.localeCompare(normalizedNumberB);
        })
        .map(song => ({
          ...song,
          formattedNumber: `${
            songCategoryToPrefixMap[song.language]?.[song.category] || ''
          }${song.number}`,
        })) ?? null,
    [data, language],
  );

  const fuse = useMemo<Fuse<ExtendedSongSummary> | null>(
    () =>
      filteredSongs
        ? new Fuse(filteredSongs, {
            keys: ['formattedNumber', 'title'],
            ignoreLocation: true,
          })
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
    event => {
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
          <TextField
            type="search"
            size="small"
            placeholder="Cerca"
            sx={{ width: 192 }}
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
        }
        topbarContent={
          <Tabs
            textColor="inherit"
            indicatorColor="secondary"
            value={language}
            {...(isNarrow ? { centered: true } : { variant: 'fullWidth' })}
          >
            <Tab
              component={Link}
              to={{
                pathname: '/canti',
                search: mergeSearchParams(searchParams, {
                  lingua: 'it',
                }).toString(),
              }}
              value="it"
              label="Italiano"
            />
            <Tab
              component={Link}
              to={{
                pathname: '/canti',
                search: mergeSearchParams(searchParams, {
                  lingua: 'de',
                }).toString(),
              }}
              value="de"
              label="Tedesco"
            />
            <Tab
              component={Link}
              to={{
                pathname: '/canti',
                search: mergeSearchParams(searchParams, {
                  lingua: 'pt',
                }).toString(),
              }}
              value="pt"
              label="Portoghese"
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
