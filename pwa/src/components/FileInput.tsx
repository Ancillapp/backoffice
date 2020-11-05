import React, { FunctionComponent, useCallback } from 'react';

import { useDropzone, DropzoneOptions } from 'react-dropzone';

import {
  IconButton,
  IconButtonProps,
  makeStyles,
  TextField,
  TextFieldProps,
} from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';

export interface FileInputProps
  extends Omit<
    TextFieldProps,
    'value' | 'defaultValue' | 'onChange' | 'onInput'
  > {
  value?: File | null;
  onChange?(file: File | null): void;
}

const useStyles = makeStyles(() => ({
  clickable: {
    cursor: 'pointer',
  },
  fileName: {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const FileInput: FunctionComponent<FileInputProps> = ({
  value = null,
  onChange,
  disabled,
  InputProps,
  inputProps,
  ...props
}) => {
  const classes = useStyles(props);

  const handleFileDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    ([file]) => {
      onChange?.(file);
    },
    [onChange],
  );

  const handleFileRemoval = useCallback<
    NonNullable<IconButtonProps['onClick']>
  >(
    (event) => {
      event.stopPropagation();
      onChange?.(null);
    },
    [onChange],
  );

  const handleTextFieldClick = useCallback<
    NonNullable<TextFieldProps['onClick']>
  >(
    (event) => {
      if (disabled) {
        event.stopPropagation();
      }
    },
    [disabled],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    multiple: false,
  });

  return (
    <TextField
      {...(getRootProps({
        InputProps: {
          className: `${classes.clickable} ${InputProps?.className || ''}`,
          readOnly: true,
          startAdornment: <input {...getInputProps()} />,
          ...(value && {
            endAdornment: (
              <IconButton
                edge="end"
                size="small"
                onClick={handleFileRemoval}
                disabled={disabled}
              >
                <ClearIcon />
              </IconButton>
            ),
          }),
          ...InputProps,
        },
        inputProps: {
          className: `${classes.clickable} ${inputProps?.className || ''}`,
          ...inputProps,
        },
        value: isDragActive
          ? 'Rilascia il file qui.'
          : value?.name ||
            (disabled
              ? ''
              : 'Premi per scegliere un file, oppure trascinalo qui.'),
        disabled,
        onClick: handleTextFieldClick,
        ...props,
      }) as TextFieldProps)}
    />
  );
};

export default FileInput;
