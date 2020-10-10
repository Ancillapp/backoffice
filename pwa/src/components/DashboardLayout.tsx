import React, { FunctionComponent } from 'react';

import { makeStyles } from '@material-ui/core';

import Masonry from './Masonry';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: theme.breakpoints.width('md'),
    margin: '0 auto',
  },
}));

const DashboardLayout: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Masonry spacing={3}>{children}</Masonry>
    </div>
  );
};

export default DashboardLayout;
