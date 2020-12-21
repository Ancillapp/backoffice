import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Link, LinkProps, useHistory, useRouteMatch } from 'react-router-dom';

import slugify from 'slugify';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import {
  Prayer,
  PrayerLanguage,
  usePrayer,
  usePrayerDeletion,
  usePrayerUpdate,
} from '../../providers/ApiProvider';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import Loader from '../../components/common/Loader';
import PageSkeleton from '../../components/common/PageSkeleton';
import TopbarIcon from '../../components/common/TopbarIcon';
import PrayerForm, {
  PrayerFormProps,
} from '../../components/prayers/PrayerForm';

const supportedLanguages: PrayerLanguage[] = ['it', 'la', 'de', 'en', 'pt'];

const languageTranslationsMap: Record<PrayerLanguage, string> = {
  it: 'Italiano',
  la: 'Latino',
  en: 'Inglese',
  de: 'Tedesco',
  pt: 'Portoghese',
};

const PrayerDetail: FunctionComponent<
  Omit<TopbarLayoutProps, 'startAdornment'>
> = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [language, setLanguage] = useState<PrayerLanguage>();

  const theme = useTheme();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const {
    params: { slug },
  } = useRouteMatch<{ slug: string }>();

  const history = useHistory();

  const { loading, data, error, refetch } = usePrayer(slug);

  const formData = Object.keys(data?.title || {}).map((language) => ({
    language: language as PrayerLanguage,
    title: data?.title[language as keyof Prayer['title']],
    content: data?.content[language as keyof Prayer['content']],
  }));

  useEffect(() => {
    if (!language) {
      setLanguage(formData[0]?.language);
    }
  }, [formData, language]);

  const [updatePrayer, { loading: updatingPrayer }] = usePrayerUpdate(slug);
  const [deletePrayer, { loading: deletingPrayer }] = usePrayerDeletion(slug);

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
      if (updatingPrayer) {
        event.preventDefault();
      }
    },
    [updatingPrayer],
  );

  const handleLanguageChange = useCallback(
    (_: ChangeEvent<{}>, lang: PrayerLanguage) => {
      setLanguage(lang);
    },
    [],
  );

  const handleSubmit = useCallback<NonNullable<PrayerFormProps['onSubmit']>>(
    async ({ title, content }) => {
      if (!data || !language) {
        return;
      }

      const computedSlug =
        language === 'it'
          ? slugify(title, {
              lower: true,
            })
          : data.slug;

      const payload = {
        ...(data.slug !== computedSlug && {
          slug: computedSlug,
        }),
        ...(data.title[language] !== title && {
          title: {
            ...data.title,
            [language]: title,
          },
        }),
        ...(data.content[language] !== content && {
          content: {
            ...data.content,
            [language]: content,
          },
        }),
      };

      if (Object.keys(payload).length > 0) {
        await updatePrayer(payload);

        if (data.slug !== computedSlug) {
          history.replace(`/preghiere/${computedSlug}`);
        } else {
          await refetch();
        }
      }

      setEditMode(false);
    },
    [data, history, language, refetch, updatePrayer],
  );

  const handleReset = useCallback<
    NonNullable<PrayerFormProps['onReset']>
  >(() => {
    setEditMode(false);
  }, []);

  const handlePrayerDeletion = useCallback(async () => {
    await deletePrayer();

    history.replace('/preghiere');
  }, [deletePrayer, history]);

  if (error) {
    return <span>{error.message}</span>;
  }

  return loading || !data ? (
    <PageSkeleton />
  ) : (
    <>
      <TopbarLayout
        title={
          language && data.title[language]
            ? data.title[language]
            : Object.values(data.title)[0]
        }
        startAdornment={
          <TopbarIcon sx={{ mr: 0.5 }}>
            <Link to="/preghiere" onClick={handleBackClick}>
              <IconButton
                color="inherit"
                edge="start"
                aria-label="indietro"
                disabled={updatingPrayer}
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
                form="edit-prayer-form"
                key="cancel-editing-prayer-button"
                disabled={updatingPrayer}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                color="inherit"
                edge="end"
                aria-label="conferma"
                type="submit"
                form="edit-prayer-form"
                key="save-prayer-button"
                disabled={updatingPrayer}
              >
                {updatingPrayer && (
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
                key="delete-prayer-button"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="inherit"
                edge="end"
                aria-label="modifica"
                onClick={toggleEditMode}
                key="edit-prayer-button"
              >
                <EditIcon />
              </IconButton>
            </>
          )
        }
        topbarContent={
          language && (
            <Tabs
              value={language}
              onChange={handleLanguageChange}
              {...(isNarrow ? { centered: true } : { variant: 'fullWidth' })}
            >
              {supportedLanguages.map((supportedLanguage) => (
                <Tab
                  key={supportedLanguage}
                  label={languageTranslationsMap[supportedLanguage]}
                  value={supportedLanguage}
                  disabled={
                    (editMode || updatingPrayer) &&
                    language !== supportedLanguage
                  }
                />
              ))}
            </Tabs>
          )
        }
        {...props}
      >
        {language && (
          <PrayerForm
            id="edit-prayer-form"
            key={language}
            disabled={!editMode || updatingPrayer}
            defaultValue={{
              title: data.title[language!] || '',
              content: data.content[language!] || '',
              image: data.image
                ? new File([data.image], 'immagine.svg', {
                    type: 'image/svg+xml',
                  })
                : undefined,
            }}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        )}
      </TopbarLayout>

      <Dialog
        aria-labelledby="delete-prayer-title"
        aria-describedby="delete-prayer-text"
        open={deleteDialogOpen}
        onClose={hideDeletionConfirmationDialog}
      >
        <DialogTitle id="delete-prayer-title">
          Eliminare la preghiera?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-prayer-text">
            Una volta eliminata, la preghiera non potrà più essere recuperata.
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
            onClick={handlePrayerDeletion}
            disabled={deletingPrayer}
          >
            {deletingPrayer && <Loader size={18} />}
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrayerDetail;
