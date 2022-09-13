import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useState,
} from 'react';

import { Link, LinkProps, useHistory } from 'react-router-dom';

import slugify from 'slugify';

import {
  IconButton,
  styled,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import {
  Prayer,
  PrayerLanguage,
  usePrayerCreation,
} from '../../providers/ApiProvider';

import TopbarLayout, {
  TopbarLayoutProps,
} from '../../components/common/TopbarLayout';
import PrayerForm, {
  PrayerFormProps,
} from '../../components/prayers/PrayerForm';
import Loader from '../../components/common/Loader';
import TopbarIcon from '../../components/common/TopbarIcon';

const supportedLanguages: PrayerLanguage[] = ['it', 'la', 'de', 'en', 'pt'];

const languageTranslationsMap: Record<PrayerLanguage, string> = {
  it: 'Italiano',
  la: 'Latino',
  en: 'Inglese',
  de: 'Tedesco',
  pt: 'Portoghese',
};

const BackButton = styled(TopbarIcon)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
}));

const NewPrayer: FunctionComponent<
  Omit<TopbarLayoutProps, 'startAdornment'>
> = props => {
  const [language, setLanguage] = useState<PrayerLanguage>(
    supportedLanguages[0],
  );

  const [hasEdited, setHasEdited] = useState(false);

  const theme = useTheme();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const [createPrayer, { loading: creatingPrayer }] = usePrayerCreation();

  const history = useHistory();

  const handleBackClick = useCallback<NonNullable<LinkProps['onClick']>>(
    event => {
      if (creatingPrayer) {
        event.preventDefault();
      }
    },
    [creatingPrayer],
  );

  const handleLanguageChange = useCallback(
    (_: ChangeEvent<{}>, lang: PrayerLanguage) => {
      setLanguage(lang);
    },
    [],
  );

  const handleSubmit = useCallback<NonNullable<PrayerFormProps['onSubmit']>>(
    async ({ title, content }) => {
      if (!language) {
        return;
      }

      const computedSlug = slugify(title, { lower: true });

      await createPrayer({
        slug: computedSlug,
        title: { [language]: title } as Prayer['title'],
        content: { [language]: content } as Prayer['content'],
      });

      history.replace(`/preghiere/${computedSlug}`);
    },
    [createPrayer, history, language],
  );

  return (
    <TopbarLayout
      title="Nuova preghiera"
      startAdornment={
        <BackButton>
          <Link to="/preghiere" onClick={handleBackClick}>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="indietro"
              disabled={creatingPrayer}
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
          form="create-prayer-form"
          disabled={creatingPrayer}
        >
          {creatingPrayer && (
            <TopbarIcon>
              <Loader size={24} color="inherit" />
            </TopbarIcon>
          )}
          <SaveIcon />
        </IconButton>
      }
      topbarContent={
        language && (
          <Tabs
            textColor="inherit"
            indicatorColor="secondary"
            value={language}
            onChange={handleLanguageChange}
            {...(isNarrow ? { centered: true } : { variant: 'fullWidth' })}
          >
            {supportedLanguages.map(supportedLanguage => (
              <Tab
                key={supportedLanguage}
                label={languageTranslationsMap[supportedLanguage]}
                value={supportedLanguage}
                disabled={
                  (creatingPrayer || hasEdited) &&
                  language !== supportedLanguage
                }
              />
            ))}
          </Tabs>
        )
      }
      {...props}
    >
      <PrayerForm
        id="create-prayer-form"
        key={language}
        disabled={creatingPrayer}
        onSubmit={handleSubmit}
        onChange={({ title, content }) =>
          setHasEdited(Boolean(title || content))
        }
      />
    </TopbarLayout>
  );
};

export default NewPrayer;
