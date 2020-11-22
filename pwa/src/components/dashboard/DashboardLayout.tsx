import React, { FunctionComponent } from 'react';

import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: theme.breakpoints.width('md'),
    margin: '0 auto',

    [theme.breakpoints.down('sm')]: {
      '& > div > *': {
        width: '100%',
      },
    },
  },
}));

const DashboardLayout: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

export default DashboardLayout;
