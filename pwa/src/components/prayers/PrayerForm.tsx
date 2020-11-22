
import React, {
  FunctionComponent,
  HTMLAttributes,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { Grid, makeStyles, TextField, TextFieldProps } from '@material-ui/core';

import Page from '../common/Page';
import PrayerPreview from './PrayerPreview';
import FileInput, { FileInputProps } from '../common/FileInput';

export type PrayerFormValue = {
  title: string;
  content: string;
  image?: File;
};

export type PrayerFormState = Omit<PrayerFormValue, 'image'> & {
  image: File | null;
};

export enum PrayerFormActionType {
  INIT = 'INIT',
  SET_FIELD = 'SET_FIELD',
}

export interface InitPrayerFormAction {
  type: PrayerFormActionType.INIT;
  value: Partial<PrayerFormState>;
}

export interface SetFieldPrayerFormAction<
  F extends keyof PrayerFormState = keyof PrayerFormState
> {
  type: PrayerFormActionType.SET_FIELD;
  field: F;
  value: PrayerFormState[F];
}

export type PrayerFormAction = InitPrayerFormAction | SetFieldPrayerFormAction;

export interface PrayerFormProps
  extends Omit<
    HTMLAttributes<HTMLFormElement>,
    'defaultValue' | 'onSubmit' | 'onChange'
  > {
  disabled?: boolean;
  defaultValue?: PrayerFormValue;
  onSubmit?(value: PrayerFormValue): void;
  onChange?(value: Partial<PrayerFormValue>): void;
}

const reducePrayerForm: Reducer<PrayerFormState, PrayerFormAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case PrayerFormActionType.INIT:
      return { ...state, ...action.value };
    case PrayerFormActionType.SET_FIELD:
      return {
        ...state,
        [action.field]: action.value,
      };
  }
};

const defaultState: PrayerFormState = {
  title: '',
  content: '',
  image: null,
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

const PrayerForm: FunctionComponent<PrayerFormProps> = ({
  defaultValue,
  disabled,
  onChange,
  onSubmit,
  onReset,
  ...props
}) => {
  const classes = useStyles();

  const initialState: PrayerFormState = useMemo(
    () => ({
      ...defaultState,
      ...defaultValue,
    }),
    [defaultValue],
  );

  const [state, dispatch] = useReducer(reducePrayerForm, initialState);

  const createTextFieldInputHandler = useCallback(
    <F extends keyof PrayerFormState>(
      field: F,
    ): NonNullable<TextFieldProps['onInput']> => (event) => {
      dispatch({
        type: PrayerFormActionType.SET_FIELD,
        field,
        value: (event.target as HTMLTextAreaElement | HTMLInputElement).value,
      });
    },
    [],
  );

  const handleImageChange = useCallback<
    NonNullable<FileInputProps['onChange']>
  >((file) => {
    dispatch({
      type: PrayerFormActionType.SET_FIELD,
      field: 'image',
      value: file,
    });
  }, []);

  const handleSubmit = useCallback<
    NonNullable<HTMLAttributes<HTMLFormElement>['onSubmit']>
  >(
    (event) => {
      event.preventDefault();

      const { image, ...rest } = state;

      onSubmit?.({ ...rest, image: image || undefined });
    },
    [onSubmit, state],
  );

  const handleReset = useCallback<
    NonNullable<HTMLAttributes<HTMLFormElement>['onReset']>
  >(
    (event) => {
      dispatch({
        type: PrayerFormActionType.INIT,
        value: initialState,
      });

      onReset?.(event);
    },
    [initialState, onReset],
  );

  const PrayerFormTextField = useCallback<FunctionComponent<TextFieldProps>>(
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
        required
        {...props}
      />
    ),
    [classes.disabled],
  );

  useEffect(() => {
    const { image, ...rest } = state;

    onChange?.({ ...rest, image: image || undefined });
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
        <Grid item xs={12} md={6}>
          <PrayerFormTextField
            label="Titolo"
            onInput={createTextFieldInputHandler('title')}
            value={state.title}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FileInput
            variant="outlined"
            fullWidth
            label="Immagine"
            InputLabelProps={{
              shrink: true,
              classes: {
                disabled: classes.disabled,
              },
            }}
            InputProps={{
              classes: {
                disabled: classes.disabled,
              },
            }}
            required
            onChange={handleImageChange}
            value={state.image}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PrayerFormTextField
            multiline
            label="Testo"
            inputProps={{ className: classes.contentInput }}
            onInput={createTextFieldInputHandler('content')}
            value={state.content}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PrayerPreview content={state.content} />
        </Grid>
      </Grid>
    </Page>
  );
};

export default PrayerForm;
