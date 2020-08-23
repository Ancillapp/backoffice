import React, { FunctionComponent } from 'react';
import {
  makeStyles,
  Theme,
  CircularProgress,
  CircularProgressProps,
} from '@material-ui/core';

export interface LoaderProps extends CircularProgressProps {
  size?: number;
}

const useStyles = makeStyles<Theme, number>(() => ({
  root: (size) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: `-${size / 2}px`,
    marginLeft: `-${size / 2}px`,
  }),
}));

const Loader: FunctionComponent<LoaderProps> = ({ size = 32, ...props }) => {
  const classes = useStyles(size);

  return (
    <div className={classes.root}>
      <CircularProgress size={size} {...props} />
    </div>
  );
};

export default Loader;
