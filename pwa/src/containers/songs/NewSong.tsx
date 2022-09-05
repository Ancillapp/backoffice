import React, { FunctionComponent, useCallback } from 'react';

import { Link, LinkProps, useHistory } from 'react-router-dom';

import { IconButton } from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';

import { useSongCreation } from '../../providers/ApiProvider';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import SongForm, {
  SongFormProps,
  SongLanguage,
} from '../../components/songs/SongForm';
import Loader from '../../components/common/Loader';
import TopbarIcon from '../../components/common/TopbarIcon';

const mapLanguageToSongNumberPrefix = (language: SongLanguage): string => {
  switch (language) {
    case SongLanguage.GERMAN:
      return 'DE';
    case SongLanguage.PORTUGUESE:
      return 'PT';
    default:
      return 'IT';
  }
};

const NewSong: FunctionComponent<
  Omit<TopbarLayoutProps, 'startAdornment'>
> = props => {
  const [createSong, { loading: creatingSong }] = useSongCreation();

  const history = useHistory();

  const handleBackClick = useCallback<NonNullable<LinkProps['onClick']>>(
    event => {
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
        <TopbarIcon sx={{ mr: 0.5 }}>
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
        </TopbarIcon>
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
            <TopbarIcon>
              <Loader size={24} color="inherit" />
            </TopbarIcon>
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
