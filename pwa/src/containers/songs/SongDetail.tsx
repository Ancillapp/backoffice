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
  styled,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Done as DoneIcon,
} from '@mui/icons-material';

import {
  SongLanguage,
  SongCategory,
  useSong,
  useSongDeletion,
  useSongUpdate,
} from '../../providers/ApiProvider';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Loader from '../../components/common/Loader';
import SongForm, { SongFormProps } from '../../components/songs/SongForm';
import PageSkeleton from '../../components/common/PageSkeleton';
import TopbarIcon from '../../components/common/TopbarIcon';

const BackButton = styled(TopbarIcon)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
}));

const SongDetail: FunctionComponent<
  Omit<TopbarLayoutProps, 'startAdornment'>
> = props => {
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    params: { language, category, number },
  } = useRouteMatch<{
    language: SongLanguage;
    category: SongCategory;
    number: string;
  }>();

  const history = useHistory();

  const { loading, data, error, refetch } = useSong(language, category, number);

  const [updateSong, { loading: updatingSong }] = useSongUpdate(
    language,
    category,
    number,
  );
  const [deleteSong, { loading: deletingSong }] = useSongDeletion(
    language,
    category,
    number,
  );

  const showDeletionConfirmationDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const hideDeletionConfirmationDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode(oldEditMode => !oldEditMode);
  }, []);

  const handleBackClick = useCallback<NonNullable<LinkProps['onClick']>>(
    event => {
      if (updatingSong) {
        event.preventDefault();
      }
    },
    [updatingSong],
  );

  const handleSubmit = useCallback<NonNullable<SongFormProps['onSubmit']>>(
    async ({ language, category, number, title, content }) => {
      const payload = {
        ...(data?.language !== language && { language }),
        ...(data?.category !== category && { category }),
        ...(data?.number !== number && { number }),
        ...(data?.title !== title && { title }),
        ...(data?.content !== content && { content }),
      };

      if (Object.keys(payload).length > 0) {
        await updateSong(payload);

        if (
          data?.language !== language ||
          data?.category !== category ||
          data?.number !== number
        ) {
          history.replace(`/canti/${language}/${category}/${number}`);
        } else {
          await refetch();
        }
      }

      setEditMode(false);
    },
    [
      data?.category,
      data?.content,
      data?.language,
      data?.number,
      data?.title,
      history,
      refetch,
      updateSong,
    ],
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
          <BackButton>
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
          </BackButton>
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
          defaultValue={data}
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
