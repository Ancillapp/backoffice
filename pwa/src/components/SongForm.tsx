import React, {
  FormEventHandler,
  FunctionComponent,
  HTMLAttributes,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  SelectProps,
  TextField,
  TextFieldProps,
} from '@material-ui/core';

import Page from './Page';
import SongPreview from './SongPreview';

export enum SongLanguage {
  ITALIAN = 'IT',
  GERMAN = 'DE',
}

export interface SongFormValue {
  number: string;
  title: string;
  content: string;
  language: SongLanguage;
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
  F extends keyof SongFormState = keyof SongFormState
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
  number: '',
  title: '',
  content: '',
  language: SongLanguage.ITALIAN,
};

const useStyles = makeStyles((theme) => ({
  disabled: {
    color: theme.palette.text.primary,
  },
  contentInput: {
    minHeight: '24rem',
    lineHeight: 1.4,
  },
}));

const SongForm: FunctionComponent<SongFormProps> = ({
  defaultValue,
  disabled,
  onChange,
  onSubmit,
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

  const createTextFieldInputHandler = useCallback(
    <F extends keyof SongFormState>(
      field: F,
    ): NonNullable<TextFieldProps['onInput']> => (event) => {
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
  >((event) => {
    dispatch({
      type: SongFormActionType.SET_FIELD,
      field: 'language',
      value: event.target.value as SongLanguage,
    });
  }, []);

  const handleSubmit = useCallback<FormEventHandler>(
    (event) => {
      event.preventDefault();

      onSubmit?.(state);
    },
    [onSubmit, state],
  );

  const SongFormTextField = useCallback<FunctionComponent<TextFieldProps>>(
    ({ InputLabelProps, InputProps, ...props }) => (
      <TextField
        variant="outlined"
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
        {...props}
      >
        <Grid item xs={6} sm={3} lg={2}>
          <SongFormTextField
            label="Numero"
            onInput={createTextFieldInputHandler('number')}
            value={state.number}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={6} sm={3} lg={2}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="song-language">Lingua</InputLabel>
            <Select
              native
              label="Lingua"
              inputProps={{
                name: 'language',
                id: 'song-language',
              }}
              classes={{ disabled: classes.disabled }}
              onChange={handleLanguageChange}
              value={state.language}
              disabled={disabled}
            >
              <option value={SongLanguage.ITALIAN}>Italiano</option>
              <option value={SongLanguage.GERMAN}>Tedesco</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={8}>
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
          <SongPreview content={state.content} />
        </Grid>
      </Grid>
    </Page>
  );
};

export default SongForm;
