import React, { FunctionComponent } from 'react';

import { Link as RouterLink, LinkProps } from 'react-router-dom';

import { Link, LinkTypeMap, makeStyles } from '@material-ui/core';
import { OverrideProps } from '@material-ui/core/OverridableComponent';

const useStyles = makeStyles((theme) => ({
  root: {
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

const GrowingLink: FunctionComponent<OverrideProps<
  LinkTypeMap<LinkProps, typeof RouterLink>,
  typeof Link
>> = (props) => {
  const classes = useStyles();

  return <Link className={classes.root} component={RouterLink} {...props} />;
};

export default GrowingLink;
