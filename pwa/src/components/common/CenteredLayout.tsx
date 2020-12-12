import React, { FunctionComponent } from 'react';

import clsx from 'clsx';

import { Box, BoxProps, makeStyles, Theme } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

export interface CenteredLayoutProps extends BoxProps {
  size?: number | Breakpoint;
}

const useStyles = makeStyles<Theme, CenteredLayoutProps>((theme) => ({
  root: ({ size = 'md' }) => ({
    margin: 0,
    width: '100%',
    height: '100%',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      margin: `${theme.spacing(3)} auto`,
      width: `calc(100% - ${theme.spacing(6)})`,
      maxWidth: typeof size === 'number' ? size : theme.breakpoints.width(size),
    },
  }),
}));

const CenteredLayout: FunctionComponent<CenteredLayoutProps> = ({
  className,
  ...props
}) => {
  const classes = useStyles(props);

  return <Box className={clsx(classes.root, className)} {...props} />;
};

export default CenteredLayout;
