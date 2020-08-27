import React, { FunctionComponent, useCallback, useState } from 'react';

import { Link, LinkProps, useRouteMatch } from 'react-router-dom';

import { Box, IconButton } from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { useSong } from '../providers/ApiProvider';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Loader from '../components/Loader';
import SongForm, { SongFormProps, SongLanguage } from '../components/SongForm';

const mapSongNumberToLanguage = (number: string): SongLanguage =>
  number.startsWith('DE') ? SongLanguage.GERMAN : SongLanguage.ITALIAN;

const SongDetail: FunctionComponent<Omit<
  TopbarLayoutProps,
  'startAdornment'
>> = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [updatingSong, setUpdatingSong] = useState(false);

  const {
    params: { number },
  } = useRouteMatch<{ number: string }>();

  const { loading, data, error } = useSong(number);

  const toggleEditMode = useCallback(() => {
    setEditMode((oldEditMode) => !oldEditMode);
  }, []);

  const handleBackClick = useCallback<NonNullable<LinkProps['onClick']>>(
    (event) => {
      if (updatingSong) {
        event.preventDefault();
      }
    },
    [updatingSong],
  );

  const handleSubmit = useCallback<NonNullable<SongFormProps['onSubmit']>>(
    (data) => {
      setUpdatingSong(true);

      // TODO: actually update the song
      console.log(data);

      setUpdatingSong(false);
      setEditMode(false);
    },
    [],
  );

  const handleReset = useCallback<NonNullable<SongFormProps['onReset']>>(() => {
    setEditMode(false);
  }, []);

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <TopbarLayout
      title={
        loading || !data
          ? 'Caricamento...'
          : `${data.number.slice(2)}. ${data.title}`
      }
      startAdornment={
        <Box color="primary.contrastText" marginRight={0.5} clone>
          <Link to="/canti" onClick={handleBackClick}>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="indietro"
              disabled={updatingSong}
            >
              <ArrowBackIcon />
            </IconButton>
          </Link>
        </Box>
      }
      endAdornment={
        editMode ? (
          <>
            <IconButton
              color="inherit"
              aria-label="annulla"
              type="reset"
              form="edit-song-form"
              key="cancel-editing-song-button"
              disabled={updatingSong}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="conferma"
              type="submit"
              form="edit-song-form"
              key="save-song-button"
              disabled={updatingSong}
            >
              <DoneIcon />
              {updatingSong && (
                <Box color="primary.contrastText" clone>
                  <Loader size={24} color="inherit" />
                </Box>
              )}
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="elimina"
              onClick={console.log}
              key="delete-song-button"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="modifica"
              onClick={toggleEditMode}
              key="edit-song-button"
            >
              <EditIcon />
            </IconButton>
          </>
        )
      }
      {...props}
    >
      {loading || !data ? (
        <Loader />
      ) : (
        <SongForm
          id="edit-song-form"
          disabled={!editMode || updatingSong}
          defaultValue={{
            ...data,
            number: data.number.slice(2),
            language: mapSongNumberToLanguage(data.number),
          }}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      )}
    </TopbarLayout>
  );
};

export default SongDetail;
