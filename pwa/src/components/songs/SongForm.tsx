import React, {
  FunctionComponent,
  HTMLAttributes,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Select,
  SelectProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import Page from '../common/Page';
import SongPreview from './SongPreview';
import { SongCategory, SongLanguage } from '../../providers/ApiProvider';

export interface SongFormValue {
  language: SongLanguage;
  category: SongCategory;
  number: string;
  title: string;
  content: string;
}

export type SongFormState = SongFormValue;

export enum SongFormActionType {
  INIT = 'INIT',
  SET_FIELD = 'SET_FIELD',
}

export interface InitSongFormAction {
  type: SongFormActionType.INIT;
  value: Partial<SongFormState>;
}

export interface SetFieldSongFormAction<
  F extends keyof SongFormState = keyof SongFormState,
> {
  type: SongFormActionType.SET_FIELD;
  field: F;
  value: SongFormState[F];
}

export type SongFormAction = InitSongFormAction | SetFieldSongFormAction;

export interface SongFormProps
  extends Omit<
    HTMLAttributes<HTMLFormElement>,
    'defaultValue' | 'onSubmit' | 'onChange'
  > {
  disabled?: boolean;
  defaultValue?: SongFormValue;
  onSubmit?(value: SongFormValue): void;
  onChange?(value: Partial<SongFormValue>): void;
}

const reduceSongForm: Reducer<SongFormState, SongFormAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case SongFormActionType.INIT:
      return { ...state, ...action.value };
    case SongFormActionType.SET_FIELD:
      return {
        ...state,
        [action.field]: action.value,
      };
  }
};

const defaultState: SongFormState = {
  language: SongLanguage.ITALIAN,
  category: SongCategory.OTHER_SONGS,
  number: '',
  title: '',
  content: '',
};

const useStyles = makeStyles(theme => ({
  disabled: {
    color: theme.palette.text.primary,
  },
  contentInput: {
    minHeight: '24rem',
    lineHeight: 1.4,
    fontFamily: 'monospace',
  },
}));

const SongForm: FunctionComponent<SongFormProps> = ({
  defaultValue,
  disabled,
  onChange,
  onSubmit,
  onReset,
  ...props
}) => {
  const classes = useStyles();

  const initialState: SongFormState = useMemo(
    () => ({
      ...defaultState,
      ...defaultValue,
    }),
    [defaultValue],
  );

  const [state, dispatch] = useReducer(reduceSongForm, initialState);
  const [enablePreviewChords, setEnablePreviewChords] = useState(false);

  const createTextFieldInputHandler = useCallback(
    <F extends keyof SongFormState>(
        field: F,
      ): NonNullable<TextFieldProps['onInput']> =>
      event => {
        dispatch({
          type: SongFormActionType.SET_FIELD,
          field,
          value: (event.target as HTMLTextAreaElement | HTMLInputElement).value,
        });
      },
    [],
  );

  const handleLanguageChange = useCallback<
    NonNullable<SelectProps['onChange']>
  >(event => {
    dispatch({
      type: SongFormActionType.SET_FIELD,
      field: 'language',
      value: event.target.value as SongLanguage,
    });
  }, []);

  const handleCategoryChange = useCallback<
    NonNullable<SelectProps['onChange']>
  >(event => {
    dispatch({
      type: SongFormActionType.SET_FIELD,
      field: 'category',
      value: event.target.value as SongCategory,
    });
  }, []);

  const handleSubmit = useCallback<
    NonNullable<HTMLAttributes<HTMLFormElement>['onSubmit']>
  >(
    event => {
      event.preventDefault();

      onSubmit?.(state);
    },
    [onSubmit, state],
  );

  const handleReset = useCallback<
    NonNullable<HTMLAttributes<HTMLFormElement>['onReset']>
  >(
    event => {
      dispatch({
        type: SongFormActionType.INIT,
        value: initialState,
      });

      onReset?.(event);
    },
    [initialState, onReset],
  );

  const SongFormTextField = useCallback<FunctionComponent<TextFieldProps>>(
    ({ InputLabelProps, InputProps, ...props }) => (
      <TextField
        fullWidth
        InputLabelProps={{
          shrink: true,
          classes: {
            disabled: `${classes.disabled} ${
              InputLabelProps?.classes?.disabled || ''
            }`,
            ...InputLabelProps?.classes,
          },
          ...InputLabelProps,
        }}
        InputProps={{
          classes: {
            disabled: `${classes.disabled} ${
              InputProps?.classes?.disabled || ''
            }`,
            ...InputProps?.classes,
          },
          ...InputProps,
        }}
        required
        {...props}
      />
    ),
    [classes.disabled],
  );

  useEffect(() => {
    onChange?.(state);
  }, [onChange, state]);

  return (
    <Page size="md">
      <Grid
        container
        spacing={3}
        component="form"
        onSubmit={handleSubmit}
        onReset={handleReset}
        {...props}
      >
        <Grid item xs={6} lg={4}>
          <SongFormTextField
            label="Numero"
            onInput={createTextFieldInputHandler('number')}
            value={state.number}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={6} lg={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="song-language">Lingua *</InputLabel>
            <Select
              native
              label="Lingua *"
              inputProps={{
                name: 'language',
                id: 'song-language',
              }}
              classes={{ disabled: classes.disabled }}
              onChange={handleLanguageChange}
              value={state.language}
              disabled={disabled}
              required
            >
              <option value={SongLanguage.ITALIAN}>Italiano</option>
              <option value={SongLanguage.GERMAN}>Tedesco</option>
              <option value={SongLanguage.PORTUGUESE}>Portoghese</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={4}>
          <FormControl fullWidth>
            <InputLabel htmlFor="song-category">Categoria *</InputLabel>
            <Select
              native
              label="Categoria *"
              inputProps={{
                name: 'category',
                id: 'song-category',
              }}
              classes={{ disabled: classes.disabled }}
              onChange={handleCategoryChange}
              value={state.category}
              disabled={disabled}
              required
            >
              <option value={SongCategory.KYRIE}>Kyrie</option>
              <option value={SongCategory.GLORY}>Gloria</option>
              <option value={SongCategory.HALLELUJAH}>Alleluia</option>
              <option value={SongCategory.CREED}>Credo</option>
              <option value={SongCategory.OFFERTORY}>Offertorio</option>
              <option value={SongCategory.HOLY}>Santo</option>
              <option value={SongCategory.ANAMNESIS}>Anamnesi</option>
              <option value={SongCategory.AMEN}>Amen</option>
              <option value={SongCategory.OUR_FATHER}>Padre Nostro</option>
              <option value={SongCategory.LAMB_OF_GOD}>Agnello di Dio</option>
              <option value={SongCategory.CANONS_AND_REFRAINS}>
                Canoni e Ritornelli
              </option>
              <option value={SongCategory.FRANCISCANS}>Francescani</option>
              <option value={SongCategory.PRAISE_AND_FAREWELL}>
                Lode e Congedo
              </option>
              <option value={SongCategory.ENTRANCE}>Ingresso</option>
              <option value={SongCategory.HOLY_SPIRIT}>Spirito Santo</option>
              <option value={SongCategory.WORSHIP}>Adorazione</option>
              <option value={SongCategory.EUCHARIST}>Comunione</option>
              <option value={SongCategory.BENEDICTUS}>Benedictus</option>
              <option value={SongCategory.MAGNIFICAT}>Magnificat</option>
              <option value={SongCategory.CANTICLES}>Cantici</option>
              <option value={SongCategory.HYMNS}>Inni</option>
              <option value={SongCategory.SIMPLE_PRAYER}>
                Preghiera Semplice
              </option>
              <option value={SongCategory.MARIANS}>Mariani</option>
              <option value={SongCategory.ANIMATION}>Animazione</option>
              <option value={SongCategory.GREGORIANS}>Gregoriani</option>
              <option value={SongCategory.ADVENT}>Avvento</option>
              <option value={SongCategory.CHRISTMAS}>Natale</option>
              <option value={SongCategory.LENT}>Quaresima</option>
              <option value={SongCategory.OTHER_SONGS}>Altri Canti</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={12}>
          <SongFormTextField
            label="Titolo"
            onInput={createTextFieldInputHandler('title')}
            value={state.title}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SongFormTextField
            multiline
            label="Testo"
            inputProps={{ className: classes.contentInput }}
            onInput={createTextFieldInputHandler('content')}
            value={state.content}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SongPreview
            content={state.content}
            enableChords={enablePreviewChords}
          />
        </Grid>
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            value={enablePreviewChords}
            onChange={event => setEnablePreviewChords(event.target.checked)}
            color="secondary"
          />
        }
        label="Visualizza accordi"
      />
    </Page>
  );
};

export default SongForm;
