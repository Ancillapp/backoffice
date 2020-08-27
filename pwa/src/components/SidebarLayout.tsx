import React, { FunctionComponent, ReactNode } from 'react';

import {
  Drawer,
  Toolbar,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Divider,
  DrawerProps,
} from '@material-ui/core';

export interface SidebarLayoutProps extends DrawerProps {
  menuContent?: ReactNode;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '100%',
  },
  toolbar: theme.mixins.toolbar,
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
          <Typography variant="h6">Ancillapp Backoffice</Typography>
        </Toolbar>
        <Divider />
        <div className={classes.menu}>{menuContent}</div>
      </Drawer>

      <div className={classes.content}>{children}</div>
    </div>
  );
};
export default SidebarLayout;
