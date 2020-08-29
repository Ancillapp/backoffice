import React, { FunctionComponent, useCallback } from 'react';

import { Link, LinkProps, useHistory } from 'react-router-dom';

import { Box, IconButton } from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';

import { useSongCreation } from '../providers/ApiProvider';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import SongForm, { SongFormProps, SongLanguage } from '../components/SongForm';
import Loader from '../components/Loader';

const mapLanguageToSongNumberPrefix = (language: SongLanguage): string =>
  language === SongLanguage.GERMAN ? 'DE' : 'IT';

const NewSong: FunctionComponent<Omit<TopbarLayoutProps, 'startAdornment'>> = (
  props,
) => {
  const [createSong, { loading: creatingSong }] = useSongCreation();

  const history = useHistory();

  const handleBackClick = useCallback<NonNullable<LinkProps['onClick']>>(
    (event) => {
      if (creatingSong) {
        event.preventDefault();
      }
    },
    [creatingSong],
  );

  const handleSubmit = useCallback<NonNullable<SongFormProps['onSubmit']>>(
    async ({ language, number, ...rest }) => {
      const computedNumber = `${mapLanguageToSongNumberPrefix(
        language,
      )}${number}`;

      await createSong({
        number: computedNumber,
        ...rest,
      });

      history.replace(`/canti/${computedNumber}`);
    },
    [createSong, history],
  );

  return (
    <TopbarLayout
      title="Nuovo canto"
      startAdornment={
        <Box color="primary.contrastText" marginRight={0.5} clone>
          <Link to="/canti" onClick={handleBackClick}>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="indietro"
              disabled={creatingSong}
            >
              <ArrowBackIcon />
            </IconButton>
          </Link>
        </Box>
      }
      endAdornment={
        <IconButton
          color="inherit"
          edge="end"
          aria-label="conferma"
          type="submit"
          form="create-song-form"
          disabled={creatingSong}
        >
          {creatingSong && (
            <Box color="primary.contrastText" clone>
              <Loader size={24} color="inherit" />
            </Box>
          )}
          <SaveIcon />
        </IconButton>
      }
      {...props}
    >
      <SongForm
        id="create-song-form"
        disabled={creatingSong}
        onSubmit={handleSubmit}
      />
    </TopbarLayout>
  );
};

export default NewSong;
