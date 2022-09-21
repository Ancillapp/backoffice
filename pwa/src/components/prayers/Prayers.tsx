import React, { FunctionComponent } from 'react';

import { Link, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { Link as RouterLink } from 'react-router-dom';

import { PrayerSummary } from '../../providers/ApiProvider';

export interface PrayersProps {
  items: PrayerSummary[];
}

const useStyles = makeStyles(theme => ({
  prayersContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
  },
  prayer: {
    width: 320,
    height: 128,
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[1],
    margin: theme.spacing(1),
    willChange: 'transform',
    transition: theme.transitions.create('transform', {
      duration: 300,
    }),
    position: 'relative',
    overflow: 'hidden',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',

    '&:hover, &:active': {
      transform: 'scale(1.025)',
      textDecoration: 'none',
    },
  },
  prayerImage: {
    fill: theme.palette.divider,
    position: 'absolute',
    top: theme.spacing(-2),
    left: theme.spacing(-2),
    width: 160,
    height: 160,
    pointerEvents: 'none',
    opacity: 0.75,
    zIndex: -1,

    '& > svg': {
      height: '100%',
    },
  },
}));

const Prayers: FunctionComponent<PrayersProps> = ({ items }) => {
  const classes = useStyles();

  return (
    <div className={classes.prayersContainer}>
      {items.map(
        ({
          slug,
          title: { pt, de = pt, en = de, la = en, it: title = la },
          image,
        }) => (
          <Link
            color="secondary"
            component={RouterLink}
            to={`/preghiere/${slug}`}
            key={slug}
            className={classes.prayer}
          >
            <div
              className={classes.prayerImage}
              {...(image && { dangerouslySetInnerHTML: { __html: image } })}
            />
            <Typography variant="subtitle1" align="center">
              {title}
            </Typography>
          </Link>
        ),
      )}
    </div>
  );
};

export default Prayers;
