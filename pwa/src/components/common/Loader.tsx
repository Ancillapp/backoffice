import React, { FunctionComponent } from 'react';
import {
  makeStyles,
  Theme,
  CircularProgress,
  CircularProgressProps,
  LinearProgressProps,
  LinearProgress,
} from '@material-ui/core';

export interface CircularLoaderProps
  extends Omit<CircularProgressProps, 'variant' | 'size'> {
  variant?: 'circular';
  size?: number;
}

export interface LinearLoaderProps
  extends Omit<LinearProgressProps, 'variant'> {
  variant: 'linear';
}

export type LoaderProps = CircularLoaderProps | LinearLoaderProps;

const useStyles = makeStyles<Theme, { size?: number }>((theme) => ({
  root: ({ size }) => ({
    position: 'absolute',
    top: '50%',

    ...(typeof size === 'undefined'
      ? {
          left: theme.spacing(2),
          width: `calc(100% - ${theme.spacing(4)})`,
          marginTop: theme.spacing(0.25),
        }
      : {
          left: '50%',
          marginTop: `-${size / 2}px`,
          marginLeft: `-${size / 2}px`,
        }),
  }),
}));

const Loader: FunctionComponent<LoaderProps> = (props) => {
  const classes = useStyles({
    size: props.variant === 'linear' ? undefined : props.size ?? 32,
  });

  const { variant, ...otherProps } = props;

  return (
    <div className={classes.root}>
      {props.variant === 'linear' ? (
        <LinearProgress {...(otherProps as LinearProgressProps)} />
      ) : (
        <CircularProgress {...(otherProps as CircularProgressProps)} />
      )}
    </div>
  );
};

export default Loader;
