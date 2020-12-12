import React, { FunctionComponent } from 'react';

import clsx from 'clsx';

import { Box, BoxProps, makeStyles, Theme } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

export interface PageProps extends BoxProps {
  size?: number | Breakpoint;
}

const useStyles = makeStyles<Theme, PageProps>((theme) => ({
  root: ({ size = 'sm' }) => ({
    margin: 0,
    width: '100%',
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'stretch',

    [theme.breakpoints.up('md')]: {
      flex: '0 0 auto',
      margin: theme.spacing(3),
      width: `calc(100% - ${theme.spacing(6)})`,
    },

    '& > *': {
      padding: '2rem 3rem',
      background: theme.palette.background.paper,
      width: '100%',
      maxWidth: typeof size === 'number' ? size : theme.breakpoints.width(size),
      margin: '0 auto',

      [theme.breakpoints.up('md')]: {
        borderRadius: '.5rem',
        boxShadow:
          '0 .06rem .065rem 0 rgba(0, 0, 0, 0.14), 0 .003rem .15rem 0 rgba(0, 0, 0, 0.12), 0 .09rem .0035rem -.065rem rgba(0, 0, 0, 0.2)',
      },
    },
  }),
}));

const Page: FunctionComponent<PageProps> = ({
  children,
  className,
  ...props
}) => {
  const classes = useStyles(props);

  return (
    <Box className={clsx(classes.root, className)} {...props}>
      <Box component="section">{children}</Box>
    </Box>
  );
};

export default Page;
