import React, { FunctionComponent, useCallback, useState } from 'react';

import { Link, useRouteMatch } from 'react-router-dom';

import { Box, IconButton } from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { useSong } from '../providers/ApiProvider';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Loader from '../components/Loader';
import SongForm, { SongLanguage } from '../components/SongForm';

const mapSongNumberToLanguage = (number: string): SongLanguage =>
  number.startsWith('DE') ? SongLanguage.GERMAN : SongLanguage.ITALIAN;

const SongDetail: FunctionComponent<Omit<
  TopbarLayoutProps,
  'startAdornment'
>> = (props) => {
  const [editMode, setEditMode] = useState(false);

  const {
    params: { number },
  } = useRouteMatch<{ number: string }>();

  const { loading, data, error } = useSong(number);

  const toggleEditMode = useCallback(() => {
    setEditMode((oldEditMode) => !oldEditMode);
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
          <Link to="/canti">
            <IconButton color="inherit" edge="start" aria-label="indietro">
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
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="conferma"
              type="submit"
              form="edit-song-form"
            >
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="elimina"
              onClick={console.log}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="modifica"
              onClick={toggleEditMode}
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
          disabled={!editMode}
          defaultValue={{
            ...data,
            number: data.number.slice(2),
            language: mapSongNumberToLanguage(data.number),
          }}
          onSubmit={console.log}
        />
      )}
    </TopbarLayout>
  );
};

export default SongDetail;
