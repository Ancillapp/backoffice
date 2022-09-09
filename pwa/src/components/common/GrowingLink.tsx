import React, { FunctionComponent } from 'react';

import { Link as RouterLink, LinkProps } from 'react-router-dom';

import clsx from 'clsx';

import { Link, LinkTypeMap } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { OverrideProps } from '@mui/material/OverridableComponent';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    willChange: 'transform',
    transition: theme.transitions.create('transform', {
      duration: 300,
    }),

    '&:hover, &:active': {
      textDecoration: 'none',
      transform: 'scale(1.025)',
    },
  },
}));

const GrowingLink: FunctionComponent<
  OverrideProps<LinkTypeMap<LinkProps, typeof RouterLink>, typeof Link>
> = ({ className, ...props }) => {
  const classes = useStyles();

  return (
    <Link
      className={clsx(classes.root, className)}
      component={RouterLink}
      {...props}
    />
  );
};

export default GrowingLink;
