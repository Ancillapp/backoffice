import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

import { Link } from 'react-router-dom';

import Fuse from 'fuse.js';

import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';

import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import { PrayerSummary, usePrayers } from '../../providers/ApiProvider';
import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Prayers from '../../components/prayers/Prayers';
import AutosizedFab from '../../components/common/AutosizedFab';
import Loader from '../../components/common/Loader';

const PrayersList: FunctionComponent<TopbarLayoutProps> = props => {
  const [search, setSearch] = useState('');
  const [displayedPrayers, setDisplayedPrayers] = useState<PrayerSummary[]>([]);

  const { loading, data, error } = usePrayers();

  const fuse = useMemo<Fuse<PrayerSummary> | null>(
    () =>
      data
        ? new Fuse(data, {
            keys: ['title.it', 'title.la', 'title.de', 'title.en', 'title.pt'],
          })
        : null,
    [data],
  );

  useEffect(() => {
    if (!data) {
      setDisplayedPrayers([]);
      return;
    }

    if (!fuse || !search) {
      setDisplayedPrayers(data);
      return;
    }

    const searchResults = fuse.search(search);

    setDisplayedPrayers(searchResults.map(({ item }) => item));
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
    <>
      <TopbarLayout
        title="Preghiere"
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
        {loading ? <Loader /> : <Prayers items={displayedPrayers} />}
      </TopbarLayout>

      <Link to="/preghiere/nuova">
        <AutosizedFab>
          <AddIcon />
        </AutosizedFab>
      </Link>
    </>
  );
};

export default PrayersList;
