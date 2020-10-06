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

import { PrayerSummary, usePrayers } from '../providers/ApiProvider';
import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Prayers from '../components/Prayers';
import AutosizedFab from '../components/FloatingActionButton';
import Loader from '../components/Loader';

const PrayersList: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [search, setSearch] = useState('');
  const [displayedPrayers, setDisplayedPrayers] = useState<PrayerSummary[]>([]);

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
