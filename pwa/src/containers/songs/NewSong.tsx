import React, { FunctionComponent, useCallback } from 'react';

import { Link, LinkProps, useHistory } from 'react-router-dom';

import { IconButton, styled } from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { useSongCreation } from '../../providers/ApiProvider';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import SongForm, { SongFormProps } from '../../components/songs/SongForm';
import Loader from '../../components/common/Loader';
import TopbarIcon from '../../components/common/TopbarIcon';

const BackButton = styled(TopbarIcon)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
}));

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
    async data => {
      await createSong(data);

      history.replace(
        `/canti/${data.language}/${data.category}/${data.number}`,
      );
    },
    [createSong, history],
  );

  return (
    <TopbarLayout
      title="Nuovo canto"
      startAdornment={
        <BackButton>
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
        </BackButton>
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
