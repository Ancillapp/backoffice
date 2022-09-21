import React, { FunctionComponent, ReactNode } from 'react';

import { Link } from 'react-router-dom';

import {
  Drawer,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  DrawerProps,
  IconButton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { ExitToApp as ExitToAppIcon } from '@mui/icons-material';

import { Tau as TauIcon } from '../icons';

export interface SidebarLayoutProps extends DrawerProps {
  menuContent?: ReactNode;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    minHeight: '100%',
  },
  toolbar: {
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',

    '& > svg': {
      height: theme.spacing(3.5),
      paddingBottom: theme.spacing(0.5),
      marginRight: theme.spacing(2),
    },

    '& > span': {
      paddingTop: theme.spacing(0.5),
    },
  },
  menu: {
    width: 'min(100vw - 56px, 280px)',

    [theme.breakpoints.up('sm')]: {
      width: 'min(100vw - 64px, 320px)',
    },
  },
  content: {
    width: '100vw',
    minHeight: '100vh',
    float: 'right',
    position: 'relative',

    [theme.breakpoints.up('sm')]: {
      width: 'calc(100vw - min(100vw - 64px, 320px))',
    },
  },
}));

const SidebarLayout: FunctionComponent<SidebarLayoutProps> = ({
  menuContent,
  open,
  children,
  ...props
}) => {
  const theme = useTheme();

  const classes = useStyles();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div className={classes.root}>
      <Drawer
        anchor="left"
        variant={isNarrow ? 'permanent' : 'temporary'}
        open={isNarrow || open}
        {...props}
      >
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.header}>
            <TauIcon />
            <span>Ancillapp Backoffice</span>
          </Typography>
          <Link to="/disconnessione">
            <IconButton edge="end" aria-label="esci">
              <ExitToAppIcon />
            </IconButton>
          </Link>
        </Toolbar>
        <Divider />
        <div className={classes.menu}>{menuContent}</div>
      </Drawer>

      <div className={classes.content}>{children}</div>
    </div>
  );
};
export default SidebarLayout;
