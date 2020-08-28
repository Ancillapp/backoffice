import React, { FunctionComponent, useCallback, useState } from 'react';

import { Link, LinkProps, useHistory, useRouteMatch } from 'react-router-dom';

import { Box, IconButton } from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { useSong, useSongUpdate } from '../providers/ApiProvider';

import TopbarLayout, { TopbarLayoutProps } from '../components/TopbarLayout';
import Loader from '../components/Loader';
import SongForm, { SongFormProps, SongLanguage } from '../components/SongForm';
import PageSkeleton from '../components/PageSkeleton';

const mapSongNumberToLanguage = (number: string): SongLanguage =>
  number.startsWith('DE') ? SongLanguage.GERMAN : SongLanguage.ITALIAN;

const mapLanguageToSongNumberPrefix = (language: SongLanguage): string =>
  language === SongLanguage.GERMAN ? 'DE' : 'IT';

const SongDetail: FunctionComponent<Omit<
  TopbarLayoutProps,
  'startAdornment'
>> = (props) => {
  const [editMode, setEditMode] = useState(false);

  const {
    params: { number },
  } = useRouteMatch<{ number: string }>();

  const history = useHistory();

  const { loading, data, error } = useSong(number);

  const [updateSong, { loading: updatingSong }] = useSongUpdate(number);

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
    async ({ number, title, content, language }) => {
      const computedNumber = `${mapLanguageToSongNumberPrefix(
        language,
      )}${number}`;

      const payload = {
        ...(data?.number !== computedNumber && { number: computedNumber }),
        ...(data?.title !== title && { title }),
        ...(data?.content !== content && { content }),
      };

      if (Object.keys(payload).length > 0) {
        await updateSong(payload);
      }

      setEditMode(false);

      if (data?.number !== computedNumber) {
        history.replace(`/canti/${computedNumber}`);
      }
    },
    [data?.content, data?.number, data?.title, history, updateSong],
  );

  const handleReset = useCallback<NonNullable<SongFormProps['onReset']>>(() => {
    setEditMode(false);
  }, []);

  if (error) {
    return <span>{error.message}</span>;
  }

  return loading || !data ? (
    <PageSkeleton />
  ) : (
    <TopbarLayout
      title={`${data.number.slice(2)}. ${data.title}`}
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
    </TopbarLayout>
  );
};

export default SongDetail;
