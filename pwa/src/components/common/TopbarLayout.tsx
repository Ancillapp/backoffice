import React, {
  FunctionComponent,
  useCallback,
  ReactNode,
  PropsWithChildren,
} from 'react';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { Menu as MenuIcon } from '@mui/icons-material';

export interface TopbarLayoutProps {
  title?: ReactNode;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  topbarContent?: ReactNode;
  onMenuButtonClick?(): void;
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  appBar: {
    flex: '0 0 auto',
  },
  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  menuButton: {
    marginRight: theme.spacing(0.5),
  },
  toolbar: theme.mixins.toolbar,
  title: {
    fontFamily: theme.typography.fontFamily,
    flex: '1 1 auto',
  },
  menu: {
    width: 'min(100vw - 56px, 280px)',

    [theme.breakpoints.up('sm')]: {
      width: 'min(100vw - 64px, 320px)',
    },
  },
}));

const TopbarLayout: FunctionComponent<PropsWithChildren<TopbarLayoutProps>> = ({
  title = 'Ancillapp',
  startAdornment,
  endAdornment,
  topbarContent,
  onMenuButtonClick,
  children,
}) => {
  const theme = useTheme();

  const classes = useStyles();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const handleMenuButtonClick = useCallback(() => {
    onMenuButtonClick?.();
  }, [onMenuButtonClick]);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          {!isNarrow && typeof startAdornment === 'undefined' ? (
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={handleMenuButtonClick}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            startAdornment
          )}
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          {endAdornment}
        </Toolbar>

        {topbarContent}
      </AppBar>

      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default TopbarLayout;
