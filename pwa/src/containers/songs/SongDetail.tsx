import React, { FunctionComponent, useCallback, useState } from 'react';

import { Helmet } from 'react-helmet';

import { Link, LinkProps, useHistory, useRouteMatch } from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import {
  useSong,
  useSongDeletion,
  useSongUpdate,
} from '../../providers/ApiProvider';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Loader from '../../components/common/Loader';
import SongForm, {
  SongFormProps,
  SongLanguage,
} from '../../components/songs/SongForm';
import PageSkeleton from '../../components/common/PageSkeleton';
import TopbarIcon from '../../components/common/TopbarIcon';

const mapSongNumberToLanguage = (number: string): SongLanguage =>
  number.startsWith('DE') ? SongLanguage.GERMAN : SongLanguage.ITALIAN;

const mapLanguageToSongNumberPrefix = (language: SongLanguage): string =>
  language === SongLanguage.GERMAN ? 'DE' : 'IT';

const SongDetail: FunctionComponent<
  Omit<TopbarLayoutProps, 'startAdornment'>
> = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    params: { number },
  } = useRouteMatch<{ number: string }>();

  const history = useHistory();

  const { loading, data, error, refetch } = useSong(number);

  const [updateSong, { loading: updatingSong }] = useSongUpdate(number);
  const [deleteSong, { loading: deletingSong }] = useSongDeletion(number);

  const showDeletionConfirmationDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const hideDeletionConfirmationDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

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

        if (data?.number !== computedNumber) {
          history.replace(`/canti/${computedNumber}`);
        } else {
          await refetch();
        }
      }

      setEditMode(false);
    },
    [data?.content, data?.number, data?.title, history, refetch, updateSong],
  );

  const handleReset = useCallback<NonNullable<SongFormProps['onReset']>>(() => {
    setEditMode(false);
  }, []);

  const handleSongDeletion = useCallback(async () => {
    await deleteSong();

    history.replace('/canti');
  }, [deleteSong, history]);

  if (error) {
    return <span>{error.message}</span>;
  }

  return loading || !data ? (
    <PageSkeleton />
  ) : (
    <>
      <Helmet>
        <title>
          {data.number.slice(2)}. {data.title}
        </title>
      </Helmet>

      <TopbarLayout
        title={`${data.number.slice(2)}. ${data.title}`}
        startAdornment={
          <TopbarIcon sx={{ mr: 0.5 }}>
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
          </TopbarIcon>
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
                {updatingSong && (
                  <TopbarIcon>
                    <Loader size={24} color="inherit" />
                  </TopbarIcon>
                )}
                <DoneIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                color="inherit"
                aria-label="elimina"
                onClick={showDeletionConfirmationDialog}
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

      <Dialog
        aria-labelledby="delete-song-title"
        aria-describedby="delete-song-text"
        open={deleteDialogOpen}
        onClose={hideDeletionConfirmationDialog}
      >
        <DialogTitle id="delete-song-title">Eliminare il canto?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-song-text">
            Una volta eliminato, il canto non potrà più essere recuperato.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color="inherit"
            onClick={hideDeletionConfirmationDialog}
          >
            Annulla
          </Button>
          <Button
            color="secondary"
            onClick={handleSongDeletion}
            disabled={deletingSong}
          >
            {deletingSong && <Loader size={18} />}
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SongDetail;
