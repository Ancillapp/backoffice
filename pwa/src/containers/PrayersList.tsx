import React, {
  ChangeEvent,
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

import { PrayerSummary, usePrayers } from '../providers/ApiProvider';
import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Prayers from '../components/Prayers';
import AutosizedFab from '../components/FloatingActionButton';
import Loader from '../components/Loader';

const PrayersList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('IT');
  const [displayedPrayers, setDisplayedPrayers] = useState<PrayerSummary[]>([]);

  const theme = useTheme();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const { loading, data, error } = usePrayers();

  useEffect(() => {
    if (!data) {
      setDisplayedPrayers([]);
      return;
    }

    const filteredPrayers = data.filter(({ title }) => {
      const lowerCaseSearch = search.toLowerCase();

      return Object.values(title).some((localizedTitle) =>
        localizedTitle?.toLowerCase().includes(lowerCaseSearch),
      );
    });

    // TODO: use fuzzy search (fuse.js)
    setDisplayedPrayers(filteredPrayers);
  }, [data, language, search]);

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
        {loading ? <Loader /> : <Prayers items={displayedPrayers} />}
      </TopbarLayout>

      <Link to="/canti/nuovo">
        <AutosizedFab>
          <AddIcon />
        </AutosizedFab>
      </Link>
    </>
  );
};

export default PrayersList;
