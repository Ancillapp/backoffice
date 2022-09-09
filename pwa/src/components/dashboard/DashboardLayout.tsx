import React, { FunctionComponent, PropsWithChildren } from 'react';

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    margin: '0 auto',

    [theme.breakpoints.down('sm')]: {
      '& > div > *': {
        width: '100%',
      },
    },
  },
}));

const DashboardLayout: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

export default DashboardLayout;
