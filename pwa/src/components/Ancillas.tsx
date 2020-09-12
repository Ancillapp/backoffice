import React, { FunctionComponent } from 'react';

import { Link, makeStyles, Typography } from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom';

import { AncillaSummary } from '../providers/ApiProvider';

export interface AncillasProps {
  items: AncillaSummary[];
}

const useStyles = makeStyles((theme) => ({
  ancillasContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(3),
  },
  ancilla: {
    margin: '1rem',

    '&:hover, &:active': {
      textDecoration: 'none',
    },
  },
  ancillaThumbnail: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    width: 170,
    height: 240,
    objectFit: 'cover',
    display: 'block',
    marginBottom: theme.spacing(1.5),
    willChange: 'transform',
    transition: theme.transitions.create('transform', {
      duration: 300,
    }),

    '&:hover, &:active': {
      transform: 'scale(1.025)',
    },
  },
}));

const Ancillas: FunctionComponent<AncillasProps> = ({ items }) => {
  const classes = useStyles();

  return (
    <div className={classes.ancillasContainer}>
      {items.map(({ code, name, thumbnail }) => (
        <Link
          color="secondary"
          component={RouterLink}
          to={`/ancilla-domini/${code}`}
          key={code}
          className={classes.ancilla}
        >
          <img
            width={170}
            height={240}
            loading="lazy"
            src={thumbnail}
            alt={`Ancilla Domini - ${name}`}
            className={classes.ancillaThumbnail}
          />
          <Typography variant="subtitle1" align="center">
            {name}
          </Typography>
        </Link>
      ))}
    </div>
  );
};

export default Ancillas;
