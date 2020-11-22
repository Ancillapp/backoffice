import React, { FunctionComponent } from 'react';

import {
  Fab,
  FabProps,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: 20,
    right: 20,
  },
}));

const AutosizedFab: FunctionComponent<FabProps> = (props) => {
  const theme = useTheme();

  const classes = useStyles();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Fab
      size={isNarrow ? 'large' : 'small'}
      color="secondary"
      className={classes.root}
      {...props}
    />
  );
};

export default AutosizedFab;
